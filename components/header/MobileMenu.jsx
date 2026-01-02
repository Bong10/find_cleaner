"use client"

import Link from "next/link";
import MobileSidebar from "./mobile-sidebar";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const MobileMenu = () => {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getDashboardRoute = () => {
    if (!user?.role) return "/";
    const roleName = String(user.role).toLowerCase();
    if (roleName === "cleaner" || roleName === "candidate")
      return "/candidates-dashboard/dashboard";
    if (roleName === "employer") return "/employers-dashboard/dashboard";
    if (roleName === "admin") return "/admin-dashboard";
    return "/";
  };

  const handleAccountClick = () => {
    router.push(getDashboardRoute());
  };

  let avatarSrc = "/images/resource/avatar-1.jpg";
  if (user?.profile_picture) {
    avatarSrc = user.profile_picture;
  }

  if (!isClient) return null;

  return (
    <>
      {/* <!-- Main Header--> */}
      <header className="main-header main-header-mobile">
        <div className="auto-container">
          {/* <!-- Main box --> */}
          <div className="inner-box">
            <div className="nav-outer">
              <div className="logo-box">
                <div className="logo">
                  <Link href={isAuthenticated ? getDashboardRoute() : "/"}>
                    <Image
                      width={40}
                      height={36}
                      src="/images/logo.png"
                      alt="brand"
                    />
                    <span className="logo-text">Find Cleaner</span>
                  </Link>
                </div>
              </div>
              {/* End .logo-box */}

              <MobileSidebar />
              {/* <!-- Main Menu End--> */}
            </div>
            {/* End .nav-outer */}

            <div className="outer-box">
              {isAuthenticated && user ? (
                <>
                  {/* Favorite button */}
                  <button className="mobile-icon-btn">
                    <span className="count">1</span>
                    <span className="icon la la-heart-o"></span>
                  </button>

                  {/* Notification button */}
                  <button className="mobile-icon-btn">
                    <span className="icon la la-bell"></span>
                  </button>

                  {/* My Account button */}
                  <button 
                    className="mobile-account-btn"
                    onClick={handleAccountClick}
                  >
                    <Image
                      alt="avatar"
                      className="mobile-avatar"
                      src={avatarSrc}
                      width={32}
                      height={32}
                    />
                  </button>
                </>
              ) : (
                <>
                  <div className="login-box">
                    <a
                      href="#"
                      className="call-modal"
                      data-bs-toggle="modal"
                      data-bs-target="#loginPopupModal"
                    >
                      <span className="icon icon-user"></span>
                    </a>
                  </div>
                  {/* login popup end */}

                  <a
                    href="#"
                    className="mobile-nav-toggler"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasMenu"
                  >
                    <span className="flaticon-menu-1"></span>
                  </a>
                  {/* right humberger menu - ONLY SHOWN WHEN NOT LOGGED IN */}
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <style jsx>{`
        .main-header-mobile {
          position: relative;
          background: #FFFFFF;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          padding: 0.75rem 0;
        }

        .inner-box {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .nav-outer {
          flex: 1;
        }

        .logo-box .logo {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .logo-box .logo img {
          max-width: 40px !important;
          height: 36px !important;
        }

        .logo-text {
          font-size: 1.1rem;
          font-weight: 700;
          color: #202124;
          text-decoration: none;
        }

        .outer-box {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .mobile-icon-btn {
          position: relative;
          width: 36px;
          height: 36px;
          border: none;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #2aa389;
          transition: all 0.3s ease;
          padding: 0;
        }

        .mobile-icon-btn:active {
          transform: scale(0.95);
        }

        .mobile-icon-btn .icon {
          font-size: 20px;
          color: #2aa389;
        }

        .mobile-icon-btn .count {
          position: absolute;
          top: 2px;
          right: 2px;
          color: white;
          background: #3b82f6;
          border-radius: 999px;
          font-size: 10px;
          line-height: 14px;
          min-width: 14px;
          height: 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        .mobile-account-btn {
          width: 36px;
          height: 36px;
          border: none;
          background: transparent;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .mobile-account-btn:active {
          transform: scale(0.95);
        }

        :global(.mobile-avatar) {
          width: 32px !important;
          height: 32px !important;
          border-radius: 50% !important;
          object-fit: cover !important;
          border: 2px solid #e8e8e8;
        }

        .mobile-nav-toggler {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #696969;
          font-size: 22px;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .mobile-nav-toggler:active {
          transform: scale(0.95);
        }

        .login-box .call-modal {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2aa389;
          font-size: 20px;
          text-decoration: none;
        }

        @media (max-width: 480px) {
          .logo-text {
            font-size: 1rem;
          }

          .outer-box {
            gap: 0.25rem;
          }

          .mobile-icon-btn,
          .mobile-account-btn,
          .mobile-nav-toggler {
            width: 32px;
            height: 32px;
          }

          .mobile-icon-btn .icon {
            font-size: 18px;
          }

          :global(.mobile-avatar) {
            width: 28px !important;
            height: 28px !important;
          }
        }
      `}</style>
    </>
  );
};

export default MobileMenu;