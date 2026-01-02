'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';

export default function DashboardGuard({ children, allowedRoles }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, bootstrapping, user } = useSelector((s) => s.auth || {});

  const roleName = String(user?.role || '').toLowerCase();

  const getDashboardHome = () => {
    if (roleName === 'cleaner' || roleName === 'candidate') return '/candidates-dashboard/dashboard';
    if (roleName === 'employer') return '/employers-dashboard/dashboard';
    if (roleName === 'admin') return '/admin-dashboard';
    return '/';
  };

  useEffect(() => {
    if (!bootstrapping && !isAuthenticated) {
      const next = encodeURIComponent(pathname || '/');
      router.replace(`/login?next=${next}`);
    }
  }, [isAuthenticated, bootstrapping, pathname, router]);

  const roleAllowed =
    !Array.isArray(allowedRoles) ||
    allowedRoles.length === 0 ||
    allowedRoles.map((r) => String(r).toLowerCase()).includes(roleName);

  useEffect(() => {
    if (bootstrapping || !isAuthenticated) return;
    if (!roleAllowed) {
      router.replace(getDashboardHome());
    }
  }, [bootstrapping, isAuthenticated, roleAllowed, router, roleName]);

  if (bootstrapping) return null; // Preloader shown by AuthGate
  if (!isAuthenticated) return null;

  if (!roleAllowed) return null;

  return children;
}
