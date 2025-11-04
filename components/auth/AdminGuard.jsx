'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCurrentUser } from '@/store/slices/authSlice';

/**
 * AdminGuard - Protects admin routes
 * Checks if user is authenticated and has admin privileges (is_staff or role=Admin)
 */
const AdminGuard = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((s) => s.auth);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAdminAccess = async () => {
      // Not authenticated at all
      if (!isAuthenticated) {
        router.replace('/admin/login');
        return;
      }

      // If user data not loaded, fetch it
      if (!user && isAuthenticated) {
        try {
          const fetchedUser = await dispatch(fetchCurrentUser()).unwrap();
          
          // Check if admin/staff
          const hasAccess = fetchedUser?.is_staff || fetchedUser?.role === 'Admin';
          
          if (!hasAccess) {
            router.replace('/admin/login?error=unauthorized');
            return;
          }
          
          setChecking(false);
        } catch (err) {
          console.error('Failed to fetch user:', err);
          router.replace('/admin/login');
        }
      } else if (user) {
        // User already loaded, check access
        const hasAccess = user?.is_staff || user?.role === 'Admin';
        
        if (!hasAccess) {
          router.replace('/admin/login?error=unauthorized');
          return;
        }
        
        setChecking(false);
      }
    };

    checkAdminAccess();
  }, [isAuthenticated, user, router, dispatch]);

  // Show loading while checking
  if (checking || loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}>
        <div style={{
          textAlign: 'center',
          color: 'white',
        }}>
          <div style={{
            width: 50,
            height: 50,
            border: '4px solid rgba(255,255,255,0.3)',
            borderTopColor: 'white',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px',
          }}></div>
          <p style={{ fontSize: 16, fontWeight: 500 }}>Verifying admin access...</p>
          <style jsx>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  // Render admin content
  return <>{children}</>;
};

export default AdminGuard;
