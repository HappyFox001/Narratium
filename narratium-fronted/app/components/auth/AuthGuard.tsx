'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  fallbackUrl?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  fallbackUrl = '/login'
}) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(`${fallbackUrl}?redirect=${encodeURIComponent(window.location.pathname)}`);
    }
  }, [user, loading, router, fallbackUrl]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (user) {
    return <>{children}</>;
  }

  return null;
};

export default AuthGuard;
