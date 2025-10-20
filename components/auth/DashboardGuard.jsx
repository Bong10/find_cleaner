'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';

export default function DashboardGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, bootstrapping } = useSelector((s) => s.auth || {});

  useEffect(() => {
    if (!bootstrapping && !isAuthenticated) {
      const next = encodeURIComponent(pathname || '/');
      router.replace(`/login?next=${next}`);
    }
  }, [isAuthenticated, bootstrapping, pathname, router]);

  if (bootstrapping) return null; // Preloader shown by AuthGate
  if (!isAuthenticated) return null;
  return children;
}
