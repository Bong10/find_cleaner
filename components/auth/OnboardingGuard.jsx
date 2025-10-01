// components/auth/OnboardingGuard.jsx
"use client";
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';

const OnboardingGuard = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, bootstrapping } = useSelector((state) => state.auth);

  useEffect(() => {
    console.log('[Guard] Running check...');

    if (bootstrapping) {
      console.log('[Guard] Still bootstrapping, waiting...');
      return;
    }

    if (!isAuthenticated) {
      console.log('[Guard] User not authenticated. Redirecting to /login.');
      router.push('/login');
      return;
    }

    // This is the critical check
    if (user) {
      console.log(`[Guard] User is authenticated. Profile completed: ${user.profile_completed}`);
      if (!user.profile_completed && pathname !== '/onboarding') {
        console.log('[Guard] Profile NOT complete. Redirecting to /onboarding.');
        router.push('/onboarding');
      } else {
        console.log('[Guard] Profile complete. Access granted.');
      }
    }
  }, [user, isAuthenticated, bootstrapping, router, pathname]);

  if (bootstrapping || (isAuthenticated && !user)) {
    console.log('[Guard] Showing loading screen...');
    return <div>Loading...</div>; // Simple loader
  }

  if (user && !user.profile_completed && pathname !== '/onboarding') {
    console.log('[Guard] Preventing render while redirecting to onboarding...');
    return null; // Render nothing while redirecting
  }

  return children;
};

export default OnboardingGuard;