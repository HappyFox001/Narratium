'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { handleGoogleCallback } from '../../../services/auth';
import { useAuth } from '../../../contexts/AuthContext';
import { GOOGLE_REDIRECT_URI } from '../../../services/config';

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      setError(`Google登录失败: ${error}`);
      setTimeout(() => router.push('/'), 3000);
      return;
    }

    if (!code) {
      setError('未收到授权码');
      setTimeout(() => router.push('/'), 3000);
      return;
    }

    const processGoogleCallback = async () => {
      try {
        const authResponse = await handleGoogleCallback(code, GOOGLE_REDIRECT_URI);
        setUser(authResponse.user);
        router.push('/dashboard');
      } catch (err) {
        setError(err instanceof Error ? err.message : '登录处理失败');
        setTimeout(() => router.push('/'), 5000);
      }
    };

    processGoogleCallback();
  }, [searchParams, router, setUser]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">登录失败！</strong>
          <span className="block sm:inline"> {error}</span>
          <p className="mt-2">5秒后将自动返回首页...</p>
        </div>
      ) : (
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <h2 className="text-xl font-semibold mt-4">正在处理您的登录...</h2>
          <p className="text-gray-600 mt-2">请稍候，我们正在验证您的Google账号</p>
        </div>
      )}
    </div>
  );
}
