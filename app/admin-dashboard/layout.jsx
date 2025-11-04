'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCurrentUser } from '@/store/slices/authSlice';
import AdminHeader from '@/components/header/AdminHeader';
import AdminSidebar from '@/components/header/AdminSidebar';
import { toast } from 'react-toastify';

const AdminDashboardLayout = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!isAuthenticated) {
        router.push('/admin/login');
        return;
      }

      // Fetch user data if not loaded
      if (!user) {
        try {
          await dispatch(fetchCurrentUser()).unwrap();
        } catch (error) {
          console.error('Failed to fetch user:', error);
          toast.error('Session expired. Please login again.');
          router.push('/admin/login');
        }
      }
    };

    checkAdminAccess();
  }, [isAuthenticated, user, router, dispatch]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 991;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebarOnMobile = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // Show loading while checking auth
  if (!isAuthenticated || !user) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Verifying admin access...</p>
        <style jsx>{`
          .admin-loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }
          .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin-bottom: 16px;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          .admin-loading p {
            font-size: 16px;
            font-weight: 500;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-layout">
      {/* Backdrop for mobile */}
      {isMobile && sidebarOpen && (
        <div className="sidebar-backdrop" onClick={closeSidebarOnMobile}></div>
      )}

      <AdminSidebar isOpen={sidebarOpen} onClose={closeSidebarOnMobile} isMobile={isMobile} />
      
      <div className={`admin-main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <AdminHeader onToggleSidebar={toggleSidebar} />
        <div className="admin-content-area">
          {children}
        </div>
      </div>

      <style jsx>{`
        .admin-dashboard-layout {
          display: flex;
          min-height: 100vh;
          background: #f3f4f6;
          position: relative;
        }

        .sidebar-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 998;
          animation: fadeIn 0.3s;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .admin-main-content {
          flex: 1;
          transition: margin-left 0.3s ease;
          position: relative;
          z-index: 1;
        }

        .admin-main-content.sidebar-open {
          margin-left: 260px;
        }

        .admin-main-content.sidebar-closed {
          margin-left: 0;
        }

        .admin-content-area {
          min-height: calc(100vh - 70px);
        }

        @media (max-width: 991px) {
          .admin-main-content.sidebar-open,
          .admin-main-content.sidebar-closed {
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboardLayout;
