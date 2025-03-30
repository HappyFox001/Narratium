'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import GoogleLoginButton from '../components/auth/GoogleLoginButton';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-6 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">欢迎回到 Narratium</h1>
          <p className="mt-2 text-gray-600">登录您的账户以继续您的冒险</p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="flex flex-col gap-4">
            <GoogleLoginButton className="w-full py-2" />

            <div className="text-center text-gray-500 text-sm mt-4">
              登录即表示您同意我们的
              <Link href="/terms" className="text-blue-600 hover:text-blue-800 mx-1">
                服务条款
              </Link>
              和
              <Link href="/privacy" className="text-blue-600 hover:text-blue-800 mx-1">
                隐私政策
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
