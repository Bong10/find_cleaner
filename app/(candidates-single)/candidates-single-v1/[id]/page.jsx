"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedCleaner } from "@/store/slices/usersSlice";
import LoginPopup from "@/components/common/form/login/LoginPopup";
import FooterDefault from "@/components/footer/common-footer";
import DefaulHeader from "@/components/header/DefaulHeader2";
import MobileMenu from "@/components/header/MobileMenu";
import Contact from "@/components/candidates-single-pages/shared-components/Contact";
import Image from "next/image";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const CandidateSingleDynamicV1 = ({ params }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const id = params.id;
  
  const { selectedCleaner } = useSelector((state) => state.users);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [cleaner, setCleaner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Check if user is employer or admin - matching the header logic
  const roleName = String(user?.role || "").toLowerCase();
  const isEmployer = roleName === "employer";
  const isAdmin = user?.is_admin || user?.is_superuser;
  const isCleaner = roleName === "cleaner" || roleName === "candidate";
  const canAccessFullInfo = isEmployer || isAdmin;

  useEffect(() => {
    // First try to get from Redux state
    if (selectedCleaner) {
      setCleaner(selectedCleaner);
      setLoading(false);
    } else {
      // If not in Redux, check localStorage
      const storedCleaner = localStorage.getItem('selectedCleaner');
      if (storedCleaner) {
        try {
          const cleanerData = JSON.parse(storedCleaner);
          // Verify it's the right cleaner
          if (cleanerData.id == id || cleanerData.user?.id == id) {
            dispatch(setSelectedCleaner(cleanerData));
            setCleaner(cleanerData);
          }
        } catch (error) {
          console.error("Error parsing stored cleaner data:", error);
        }
      }
      setLoading(false);
    }
  }, [selectedCleaner, id, dispatch]);

  // Helper function to get profile image
  const getProfileImage = () => {
    if (!cleaner) return "/images/resource/candidate-1.png";
    
    const userData = cleaner.user || cleaner;
    if (userData.profile_picture) {
      if (userData.profile_picture.startsWith("http")) {
        return userData.profile_picture;
      }
      return `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}${userData.profile_picture}`;
    }
    return cleaner.avatar || "/images/resource/candidate-1.png";
  };

  // Helper function to get cleaner name
  const getCleanerName = () => {
    if (!cleaner) return "Loading...";
    if (cleaner.name) return cleaner.name;
    
    const userData = cleaner.user || cleaner;
    if (userData.first_name && userData.last_name) {
      return `${userData.first_name} ${userData.last_name}`;
    }
    return userData.name || userData.email?.split("@")[0] || "Anonymous Cleaner";
  };

  // Helper function to format date
  const getMemberSince = () => {
    if (!cleaner) return "";
    const userData = cleaner.user || cleaner;
    if (userData.date_joined) {
      const date = new Date(userData.date_joined);
      return date.toLocaleDateString("en-US", { 
        month: "short", 
        day: "numeric", 
        year: "numeric" 
      });
    }
    return "Recently joined";
  };

  // Helper function to calculate experience
  const getExperience = () => {
    if (!cleaner) return "0-1 Years";
    if (cleaner.experience) return cleaner.experience;
    if (cleaner.years_experience) {
      if (cleaner.years_experience < 1) return "0-1 Years";
      if (cleaner.years_experience < 3) return "1-3 Years";
      if (cleaner.years_experience < 5) return "3-5 Years";
      if (cleaner.years_experience < 10) return "5-10 Years";
      return "10+ Years";
    }
    return "0-1 Years";
  };

  // Helper function to get skills
  const getSkills = () => {
    if (!cleaner) return [];
    return cleaner.services || cleaner.specializations || cleaner.skills || ["House Cleaning", "Office Cleaning", "Deep Cleaning"];
  };

  // Helper function to get tags
  const getTags = () => {
    if (!cleaner) return [];
    if (cleaner.tags) return cleaner.tags;
    
    const skills = getSkills();
    const tags = [...skills.slice(0, 3)];
    
    // Add rating tag
    const reviewCount = cleaner?.reviewCount || cleaner?.review_count || 0;
    const averageRating = cleaner?.averageRating || cleaner?.average_rating || 0;
    tags.push(reviewCount > 0 ? `★ ${averageRating}` : "★ 0.0");
    
    return tags;
  };

  // Handle booking action
  const handleBookingClick = () => {
    if (!isAuthenticated) {
      toast.warning("Please log in as an employer to book a cleaner");
      router.push('/login?redirect=' + encodeURIComponent(`/book-cleaner/${id}`));
    } else if (!isEmployer) {
      toast.warning("Only employers can book cleaners. Please register as an employer.");
      router.push('/register?type=employer');
    } else {
      // Store cleaner data and navigate to booking flow
      localStorage.setItem('selectedCleaner', JSON.stringify(cleaner));
      router.push(`/book-cleaner/${id}`);
    }
  };

  // Handle shortlist action
  const handleShortlistClick = () => {
    if (!isAuthenticated) {
      toast.warning("Please log in as an employer to add to shortlist");
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
    } else if (!isEmployer) {
      toast.warning("Only employers can shortlist cleaners. Please register as an employer.");
      router.push('/register?type=employer');
    } else {
      toast.success("Added to shortlist!");
      // Add your shortlist logic here
    }
  };

  // Prepare cleaner data for booking modal
  const getCleanerDataForBooking = () => {
    return {
      id: cleaner?.id || cleaner?.user?.id || id,
      name: getCleanerName(),
      hourly_rate: cleaner?.hourly_rate || 20,
      rating: cleaner?.averageRating || cleaner?.average_rating || 0,
      profile_picture: getProfileImage(),
      services: getSkills(),
    };
  };

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh" 
      }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!cleaner) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        flexDirection: "column"
      }}>
        <h3>Cleaner Not Found</h3>
        <p>Please select a cleaner from the list first.</p>
        <a href="/candidates-list-v1" className="theme-btn btn-style-one">
          Back to List
        </a>
      </div>
    );
  }

  return (
    <>
      <LoginPopup />
      <DefaulHeader />
      <MobileMenu />

      {/* <!-- Job Detail Section --> */}
      <section className="candidate-detail-section">
        <div className="upper-box">
          <div className="auto-container">
            <div className="candidate-block-five">
              <div className="inner-box">
                <div className="content">
                  <figure className="image">
                    <Image
                      width={100}
                      height={100}
                      src={getProfileImage()}
                      alt={getCleanerName()}
                      onError={(e) => {
                        e.target.src = "/images/resource/candidate-1.png";
                      }}
                    />
                  </figure>
                  <h4 className="name">{getCleanerName()}</h4>

                  <ul className="candidate-info">
                    <li>
                      <span className="icon flaticon-map-locator"></span>
                      {cleaner?.location || cleaner?.user?.address || "Location not specified"}
                    </li>
                    <li>
                      {cleaner?.isVerified || cleaner?.is_verified ? (
                        <span style={{ color: "#52c41a" }}>
                          <i className="la la-check-circle"></i> Verified Cleaner
                        </span>
                      ) : (
                        <span style={{ color: "#696969" }}>
                          <i className="la la-times-circle"></i> Not Verified
                        </span>
                      )}
                    </li>
                    <li>
                      <span className="icon flaticon-clock"></span> Member Since {getMemberSince()}
                    </li>
                  </ul>

                  <ul className="post-tags">
                    {getTags().map((tag, i) => (
                      <li key={i}>{tag}</li>
                    ))}
                  </ul>
                </div>

                <div className="btn-box">
                  {/* Only show action buttons for employers */}
                  {isEmployer ? (
                    <>
                      <button 
                        className="theme-btn btn-style-one"
                        onClick={handleBookingClick}
                      >
                        Book Cleaner
                      </button>
                      <button 
                        className="bookmark-btn"
                        onClick={handleShortlistClick}
                        title="Add to shortlist"
                      >
                        <i className="flaticon-bookmark"></i>
                      </button>
                    </>
                  ) : isAuthenticated && isCleaner ? (
                    // Show message for cleaners viewing other cleaners
                    <div className="alert alert-info" style={{ 
                      marginBottom: 0,
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}>
                      <i className="la la-info-circle"></i> Switch to an employer account to book cleaners
                    </div>
                  ) : !isAuthenticated ? (
                    // Show login prompt for non-authenticated users
                    <>
                      <button 
                        className="theme-btn btn-style-one"
                        onClick={() => router.push('/login?redirect=' + encodeURIComponent(window.location.pathname))}
                      >
                        Login to Book
                      </button>
                      <button 
                        className="theme-btn btn-style-two ms-2"
                        onClick={() => router.push('/register?type=employer')}
                      >
                        Register as Employer
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="candidate-detail-outer">
          <div className="auto-container">
            <div className="row">
              <div className="content-column col-lg-8 col-md-12 col-sm-12">
                <div className="job-detail">
                  <h4>About {getCleanerName()}</h4>
                  <p>
                    {cleaner?.bio || `Professional cleaner with ${getExperience().toLowerCase()} of experience. 
                    Specialized in residential and commercial cleaning services. 
                    Committed to providing high-quality, reliable cleaning services to meet your needs.`}
                  </p>
                  
                  {cleaner?.description && (
                    <p>{cleaner.description}</p>
                  )}

                  {/* Services Section */}
                  <div className="resume-outer">
                    <div className="upper-title">
                      <h4>Services Offered</h4>
                    </div>
                    <div className="resume-block">
                      <div className="inner">
                        <ul className="list-style-one">
                          {getSkills().map((skill, index) => (
                            <li key={index}>{skill}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Work Experience */}
                  {cleaner?.work_experience && cleaner.work_experience.length > 0 && (
                    <div className="resume-outer theme-blue">
                      <div className="upper-title">
                        <h4>Work Experience</h4>
                      </div>
                      {cleaner.work_experience.map((exp, index) => (
                        <div className="resume-block" key={index}>
                          <div className="inner">
                            <span className="name">{exp.company}</span>
                            <div className="title-box">
                              <div className="info-box">
                                <h3>{exp.position}</h3>
                                <span>{exp.location}</span>
                              </div>
                              <div className="edit-box">
                                <span className="year">{exp.duration}</span>
                              </div>
                            </div>
                            <div className="text">{exp.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reviews Section */}
                  {cleaner?.reviews && cleaner.reviews.length > 0 && (
                    <div className="portfolio-outer">
                      <h4>Customer Reviews</h4>
                      <div className="row">
                        {cleaner.reviews.map((review, index) => (
                          <div key={index} className="col-lg-12 col-md-12 col-sm-12">
                            <div className="review-block">
                              <div className="inner">
                                <div className="rating">
                                  {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                                </div>
                                <p>{review.comment}</p>
                                <span className="reviewer">- {review.reviewer_name}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="sidebar-column col-lg-4 col-md-12 col-sm-12">
                <aside className="sidebar">
                  <div className="sidebar-widget">
                    <div className="widget-content">
                      <ul className="job-overview">
                        <li>
                          <i className="icon icon-calendar"></i>
                          <h5>Experience:</h5>
                          <span>{getExperience()}</span>
                        </li>

                        <li>
                          <i className="icon la la-phone"></i>
                          <h5>Phone:</h5>
                          <span>
                            {!canAccessFullInfo ? (
                              <span style={{ fontSize: '12px', color: '#999' }}>
                                <i className="la la-lock"></i> Login as employer to view
                              </span>
                            ) : (
                              cleaner?.user?.phone_number || "Not provided"
                            )}
                          </span>
                        </li>

                        <li>
                          <i className="icon la la-envelope"></i>
                          <h5>Email:</h5>
                          <span>
                            {!canAccessFullInfo ? (
                              <span style={{ fontSize: '12px', color: '#999' }}>
                                <i className="la la-lock"></i> Login as employer to view
                              </span>
                            ) : (
                              cleaner?.user?.email || "Not provided"
                            )}
                          </span>
                        </li>

                        {cleaner?.hourly_rate && (
                          <li>
                            <i className="icon icon-salary"></i>
                            <h5>Hourly Rate:</h5>
                            <span>£{cleaner.hourly_rate}/hour</span>
                          </li>
                        )}

                        {cleaner?.user?.gender && (
                          <li>
                            <i className="icon icon-user-2"></i>
                            <h5>Gender:</h5>
                            <span>{cleaner.user.gender}</span>
                          </li>
                        )}

                        <li>
                          <i className="icon la la-check-circle"></i>
                          <h5>Verification:</h5>
                          <span>{cleaner?.isVerified || cleaner?.is_verified ? "Verified" : "Not Verified"}</span>
                        </li>

                        {cleaner?.availability && (
                          <li>
                            <i className="icon icon-clock"></i>
                            <h5>Availability:</h5>
                            <span>{cleaner.availability}</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>

                  <div className="sidebar-widget">
                    <h4 className="widget-title">Professional Skills</h4>
                    <div className="widget-content">
                      <ul className="job-skills">
                        {getSkills().map((skill, index) => (
                          <li key={index}>
                            <a href="#">{skill}</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="sidebar-widget contact-widget">
                    <h4 className="widget-title">Contact {getCleanerName()}</h4>
                    <div className="widget-content">
                      {!canAccessFullInfo ? (
                        <div className="alert alert-info" style={{ 
                          padding: '15px', 
                          backgroundColor: '#f0f8ff', 
                          border: '1px solid #bee5eb',
                          borderRadius: '5px',
                          marginBottom: '20px'
                        }}>
                          <i className="la la-info-circle"></i>
                          <p style={{ margin: '10px 0', fontSize: '14px' }}>
                            To send messages to cleaners, please{' '}
                            <a 
                              href="#" 
                              onClick={(e) => {
                                e.preventDefault();
                                router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
                              }}
                              style={{ color: '#007bff', textDecoration: 'underline' }}
                            >
                              log in as an employer
                            </a>
                          </p>
                          <button 
                            className="theme-btn btn-style-one w-100"
                            onClick={() => router.push('/register?type=employer')}
                          >
                            Register as Employer
                          </button>
                        </div>
                      ) : (
                        <div className="default-form">
                          <Contact cleanerId={id} cleanerName={getCleanerName()} />
                        </div>
                      )}
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterDefault footerStyle="alternate5" />
    </>
  );
};

export default dynamic(() => Promise.resolve(CandidateSingleDynamicV1), {
  ssr: false,
});
