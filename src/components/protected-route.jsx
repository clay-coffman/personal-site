import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/lib/auth';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/admin/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
