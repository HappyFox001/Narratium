import { API_BASE_URL } from './config';

export interface User {
  id: string;
  email: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

const TOKEN_KEY = 'narratium_token';
const USER_KEY = 'narratium_user';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userJson = localStorage.getItem(USER_KEY);
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch (error) {
    console.error('解析用户信息失败:', error);
    return null;
  }
}

export function setCurrentUser(user: User): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function isAuthenticated(): boolean {
  return !!getToken() && !!getCurrentUser();
}

export async function handleGoogleCallback(code: string, redirect_uri?: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        redirect_uri,
      }),
    });

    if (!response.ok) {
      throw new Error(`Google登录失败: ${response.statusText}`);
    }

    const data = await response.json();

    // 保存令牌和用户信息
    setToken(data.access_token);
    setCurrentUser(data.user);

    return data;
  } catch (error) {
    console.error('Google登录错误:', error);
    throw error;
  }
}

export async function fetchCurrentUser(): Promise<User> {
  const token = getToken();
  if (!token) {
    throw new Error('未登录');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // 令牌无效，清除本地存储
        clearToken();
        throw new Error('会话已过期，请重新登录');
      }
      throw new Error(`获取用户信息失败: ${response.statusText}`);
    }

    const user = await response.json();
    setCurrentUser(user);
    return user;
  } catch (error) {
    console.error('获取用户信息错误:', error);
    throw error;
  }
}

export function logout(): void {
  clearToken();
  if (typeof window !== 'undefined') {
    window.location.href = '/';
  }
}
