"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchJobById, fetchJobEmployer, applyForJob } from "@/store/slices/jobsSlice";
import { fetchPublicJobs } from "@/store/slices/publicJobsSlice";
import { 
  loadShortlist, 
  addToShortlist, 
  removeFromShortlist 
} from "@/store/slices/shortlistSlice";
import { listApplications } from "@/services/jobsService";
import { getCleanerMe } from "@/services/cleanerService";
import LoginPopup from "@/components/common/form/login/LoginPopup";
import FooterDefault from "@/components/footer/common-footer";
import DefaulHeader from "@/components/header/DefaulHeader2";
import MobileMenu from "@/components/header/MobileMenu";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

const FALLBACK_LOGO = "/images/resource/company-logo/1-1.png";

const JobSingleDynamicV1 = ({ params }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const id = params.id;
  
  const [job, setJob] = useState(null);
  const [employer, setEmployer] = useState(null);
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cleanerPk, setCleanerPk] = useState(null);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [checkingApplication, setCheckingApplication] = useState(false);
  const [mapError, setMapError] = useState(false);
  
  // Get auth state
  const auth = useSelector((s) => s.auth) || {};
  const authUser = auth.user || auth.authUser || null;
  const roleName = String(authUser?.role || "").toLowerCase();
  const isLoggedIn =
    Boolean(auth?.isLoggedIn) ||
    Boolean(auth?.isAuthenticated) ||
    Boolean(authUser) ||
    Boolean(auth?.tokens?.access);
  const isCleaner =
    Boolean(authUser?.is_cleaner) ||
    roleName === "cleaner" ||
    roleName === "candidate" ||
    Boolean(authUser?.cleaner_profile) ||
    Boolean(authUser?.isCleaner);
  
  // Get shortlist state
  const shortlistState = useSelector((s) => s.shortlist) || {};
  const shortlistItems = Array.isArray(shortlistState.items) ? shortlistState.items : [];
  const isShortlisted = shortlistItems.some(item => 
    String(item.job?.id || item.job) === String(id)
  );

  // Check if cleaner has already applied for this job
  useEffect(() => {
    const checkApplicationStatus = async () => {
      if (!isLoggedIn || !isCleaner || !id) return;
      
      setCheckingApplication(true);
      try {
        // Get all applications for this cleaner
        const response = await listApplications();
        const applications = response.data?.results || response.data || [];
        
        // Check if any application matches this job
        const existingApplication = applications.find(app => 
          String(app.job?.id || app.job) === String(id)
        );
        
        if (existingApplication) {
          setHasApplied(true);
        }
      } catch (err) {
        console.error("Error checking application status:", err);
      } finally {
        setCheckingApplication(false);
      }
    };

    checkApplicationStatus();
  }, [id, isLoggedIn, isCleaner]);

  // Check if should open apply modal on mount
  useEffect(() => {
    if (searchParams.get('apply') === '1' && isCleaner && !hasApplied && !checkingApplication) {
      setTimeout(() => setShowApplyModal(true), 500);
    }
  }, [searchParams, isCleaner, hasApplied, checkingApplication]);

  // Load job data
  useEffect(() => {
    const loadJobData = async () => {
      setLoading(true);
      setError(null);
      
      // First try to get job from localStorage
      const storedJob = localStorage.getItem('selectedJob');
      
      if (storedJob) {
        try {
          const jobData = JSON.parse(storedJob);
          if (String(jobData.id) === String(id) || String(jobData.job_id) === String(id)) {
            setJob(jobData);
            setLoading(false);
            return jobData;
          }
        } catch (error) {
          console.error("Error parsing stored job data:", error);
        }
      }
      
      // Fetch from backend if not in cache
      try {
        const result = await dispatch(fetchJobById(id)).unwrap();
        if (result) {
          const jobData = result.data || result;
          setJob(jobData);
          localStorage.setItem('selectedJob', JSON.stringify(jobData));
          return jobData;
        }
      } catch (err) {
        console.error("Error fetching job:", err);
        setError("Unable to load job details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadJobData();
    }
  }, [id, dispatch]);

  // Load employer data (only for logged-in users)
  useEffect(() => {
    const loadEmployerData = async () => {
      if (!isLoggedIn || !job) return;
      
      try {
        const employerData = await dispatch(fetchJobEmployer(id)).unwrap();
        setEmployer(employerData);
      } catch (err) {
        console.error("Error fetching employer:", err);
        // Don't show error to user, just don't display employer info
      }
    };

    loadEmployerData();
  }, [id, job, isLoggedIn, dispatch]);

  // Load related jobs based on service names
  useEffect(() => {
    const loadRelatedJobs = async () => {
      if (!job?.service_names && !job?.services) return;
      
      const services = job.service_names || job.services || [];
      const serviceNames = services.map(s => 
        typeof s === 'object' ? (s.name || s.title) : s
      ).filter(Boolean);
      
      if (serviceNames.length === 0) return;
      
      try {
        // Fetch jobs with similar services
        const result = await dispatch(fetchPublicJobs({
          keyword: serviceNames[0], // Use first service name for better matching
          sort: 'des', // Newest first
          perPage: { start: 0, end: 10 }
        })).unwrap();
        
        if (result?.data?.results) {
          // Filter out current job and limit to 3
          const filtered = result.data.results
            .filter(j => String(j.id) !== String(id))
            .slice(0, 3);
          setRelatedJobs(filtered);
        }
      } catch (err) {
        console.error("Error fetching related jobs:", err);
      }
    };

    loadRelatedJobs();
  }, [job, id, dispatch]);

  // Load shortlist for cleaners
  useEffect(() => {
    if (isLoggedIn && isCleaner) {
      dispatch(loadShortlist());
    }
  }, [dispatch, isLoggedIn, isCleaner]);

  // Load cleaner PK
  useEffect(() => {
    const loadCleanerPk = async () => {
      if (!isLoggedIn || !isCleaner) return;
      
      try {
        const { data } = await getCleanerMe();
        setCleanerPk(data?.id || data?.pk);
      } catch (err) {
        console.error("Error fetching cleaner data:", err);
      }
    };

    loadCleanerPk();
  }, [isLoggedIn, isCleaner]);

  // Helper functions
  const getJobTitle = () => job?.title || job?.name || "Cleaning Position";
  
  const getCompanyName = () => {
    // Only show real name if logged in and employer data is available
    if (isLoggedIn && employer) {
      return employer?.business_name || 
             employer?.user?.name ||
             job?.employer?.company_name || 
             "Private Employer";
    }
    return "Login to view";
  };
  
  const getCompanyLogo = () => {
    if (isLoggedIn && employer) {
      const logo = employer?.user?.profile_picture ||
                   job?.employer?.company_logo || 
                   job?.company_logo;
      
      if (logo && !logo.startsWith('http')) {
        return `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}${logo}`;
      }
      return logo || FALLBACK_LOGO;
    }
    return FALLBACK_LOGO;
  };
  
  const getLocation = () => {
    return job?.city || 
           job?.location || 
           "Location TBD";
  };
  
  const getSalary = () => {
    const rate = job?.hourly_rate || job?.rate_per_hour;
    const hours = job?.hours_required || job?.hours;
    
    if (rate && hours) {
      const total = Number(rate) * Number(hours);
      return `£${rate}/hr • ${hours} hours (£${total.toFixed(2)} total)`;
    } else if (rate) {
      return `£${rate}/hour`;
    }
    return "Competitive rate";
  };

  // Handle shortlist toggle
  const handleShortlistToggle = async () => {
    if (!isLoggedIn) {
      toast.info("Please login to save jobs");
      router.push(`/login?next=/job-single-v1/${id}`);
      return;
    }
    
    if (!isCleaner) {
      toast.warning("Only cleaners can save jobs");
      return;
    }

    try {
      if (isShortlisted) {
        const shortlistItem = shortlistItems.find(item => 
          String(item.job?.id || item.job) === String(id)
        );
        if (shortlistItem?.id) {
          await dispatch(removeFromShortlist({ id: shortlistItem.id })).unwrap();
          toast.success("Removed from saved jobs");
        }
      } else {
        if (!cleanerPk) {
          toast.error("Unable to save job. Please try again.");
          return;
        }
        await dispatch(addToShortlist({ 
          job: Number(id), 
          cleaner: Number(cleanerPk) 
        })).unwrap();
        toast.success("Job saved successfully");
      }
      dispatch(loadShortlist());
    } catch (err) {
      toast.error("Failed to update saved jobs");
    }
  };

  // Handle job application submission
  const handleApplySubmit = async (e) => {
    e.preventDefault();
    
    if (!coverLetter.trim()) {
      toast.error("Please write a message");
      return;
    }
    
    setApplying(true);
    try {
      await dispatch(applyForJob({ 
        job: Number(id),
        cover_letter: coverLetter.trim()
      })).unwrap();
      
      toast.success("Application submitted successfully!");
      setHasApplied(true);
      setShowApplyModal(false);
      setCoverLetter("");
      
      // Update job in localStorage to persist state
      const storedJob = localStorage.getItem('selectedJob');
      if (storedJob) {
        const jobData = JSON.parse(storedJob);
        jobData.has_applied = true;
        localStorage.setItem('selectedJob', JSON.stringify(jobData));
      }
      
      // Store application status in localStorage
      const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
      if (!appliedJobs.includes(id)) {
        appliedJobs.push(id);
        localStorage.setItem('appliedJobs', JSON.stringify(appliedJobs));
      }
      
    } catch (err) {
      if (err?.detail) {
        toast.error(err.detail);
      } else if (err?.job) {
        toast.warning("You have already applied for this job");
        setHasApplied(true);
        setShowApplyModal(false);
      } else {
        toast.error("Failed to submit application. Please try again.");
      }
    } finally {
      setApplying(false);
    }
  };

  // Handle related job click
  const handleRelatedJobClick = (relatedJob) => {
    localStorage.setItem('selectedJob', JSON.stringify(relatedJob));
    router.push(`/job-single-v1/${relatedJob.id}`);
  };

  // Open location in Google Maps
  const openInGoogleMaps = () => {
    const location = getLocation();
    const query = encodeURIComponent(location);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  // Share on social media
  const shareOnFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(getJobTitle());
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${title}`, '_blank');
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(`Check out this job: ${getJobTitle()} - ${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  // Check localStorage for application status on mount
  useEffect(() => {
    const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
    if (appliedJobs.includes(id)) {
      setHasApplied(true);
    }
  }, [id]);

  // Create static map image URL (no API key needed)
  const getStaticMapUrl = () => {
    const location = encodeURIComponent(getLocation());
    return `https://maps.googleapis.com/maps/api/staticmap?center=${location}&zoom=14&size=400x250&markers=color:red%7C${location}&style=feature:poi%7Celement:labels%7Cvisibility:off&style=feature:transit%7Celement:labels%7Cvisibility:off`;
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

  if (error || !job) {
    return (
      <>
        <LoginPopup />
        <DefaulHeader />
        <MobileMenu />
        
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          minHeight: "60vh",
          flexDirection: "column",
          padding: "40px"
        }}>
          <h3>Unable to Load Job</h3>
          <p style={{ marginTop: "20px", marginBottom: "30px", color: "#666" }}>
            {error || "The job you're looking for doesn't exist."}
          </p>
          <a href="/jobs" className="theme-btn btn-style-one">
            Browse All Jobs
          </a>
        </div>
        
        <FooterDefault footerStyle="alternate5" />
      </>
    );
  }

  return (
    <>
      <LoginPopup />
      <DefaulHeader />
      <MobileMenu />

      <section className="job-detail-section">
        <div className="upper-box">
          <div className="auto-container">
            <div className="job-block-seven">
              <div className="inner-box">
                <div className="content">
                  <span className="company-logo">
                    <Image
                      width={100}
                      height={98}
                      src={getCompanyLogo()}
                      alt="logo"
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_LOGO;
                      }}
                    />
                  </span>
                  <h4>{getJobTitle()}</h4>

                  <ul className="job-info">
                    <li>
                      <span className="icon flaticon-briefcase"></span>
                      {getCompanyName()}
                    </li>
                    <li>
                      <span className="icon flaticon-map-locator"></span>
                      {getLocation()}
                    </li>
                    <li>
                      <span className="icon flaticon-clock-3"></span>
                      {job?.time || "Flexible hours"}
                    </li>
                    <li>
                      <span className="icon flaticon-money"></span>
                      {getSalary()}
                    </li>
                  </ul>

                  <ul className="job-other-info">
                    {job?.job_type && (
                      <li className="time">{job.job_type}</li>
                    )}
                    {job?.is_urgent && (
                      <li className="urgent">Urgent</li>
                    )}
                    {hasApplied && (
                      <li className="privacy" style={{ backgroundColor: '#10b981', color: '#fff' }}>
                        Applied ✓
                      </li>
                    )}
                  </ul>
                </div>

                {isCleaner && (
                  <div className="btn-box">
                    <button
                      className="theme-btn btn-style-one"
                      onClick={() => setShowApplyModal(true)}
                      disabled={hasApplied || checkingApplication}
                      style={hasApplied ? { backgroundColor: '#10b981', borderColor: '#10b981' } : {}}
                    >
                      {checkingApplication ? "Checking..." : 
                       hasApplied ? "✓ Already Applied" : "Apply For Job"}
                    </button>

                    <button 
                      className="bookmark-btn"
                      onClick={handleShortlistToggle}
                    >
                      <i 
                        className={isShortlisted ? "la la-bookmark" : "la la-bookmark-o"}
                        style={isShortlisted ? { color: '#ef4444' } : {}}
                      ></i>
                    </button>
                  </div>
                )}

                {/* Apply Modal */}
                {showApplyModal && !hasApplied && (
                  <div 
                    className="modal show d-block"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                    onClick={() => setShowApplyModal(false)}
                  >
                    <div 
                      className="modal-dialog modal-dialog-centered"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="modal-content">
                        <div className="modal-header">
                          <h3 className="modal-title">Apply for {getJobTitle()}</h3>
                          <button
                            type="button"
                            className="btn-close"
                            onClick={() => setShowApplyModal(false)}
                          ></button>
                        </div>
                        <form onSubmit={handleApplySubmit}>
                          <div className="modal-body">
                            <div className="form-group">
                              <label>Message / Cover Letter *</label>
                              <textarea
                                className="form-control"
                                rows="6"
                                placeholder="Tell the employer why you're the right person for this job..."
                                value={coverLetter}
                                onChange={(e) => setCoverLetter(e.target.value)}
                                required
                              ></textarea>
                            </div>
                          </div>
                          <div className="modal-footer">
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => setShowApplyModal(false)}
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="theme-btn btn-style-one"
                              disabled={applying}
                            >
                              {applying ? "Submitting..." : "Submit Application"}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="job-detail-outer">
          <div className="auto-container">
            <div className="row">
              <div className="content-column col-lg-8 col-md-12 col-sm-12">
                <div className="job-detail">
                  <h4>Job Description</h4>
                  <p>{job?.description || "Looking for an experienced cleaner."}</p>
                  
                  {job?.requirements && (
                    <>
                      <h4>Requirements</h4>
                      <ul className="list-style-three">
                        {(Array.isArray(job.requirements) ? job.requirements : 
                          job.requirements.split('\n').filter(Boolean)).map((req, i) => (
                          <li key={i}>{req}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>

                {/* Social Share - Only Facebook and WhatsApp */}
                <div className="other-options">
                  <div className="social-share">
                    <h5>Share this job</h5>
                    <div className="d-flex gap-2">
                      <button
                        onClick={shareOnFacebook}
                        className="btn btn-primary"
                        style={{ 
                          backgroundColor: '#1877f2', 
                          border: 'none',
                          padding: '8px 16px'
                        }}
                      >
                        <i className="fab fa-facebook-f me-2"></i>
                        Facebook
                      </button>
                      <button
                        onClick={shareOnWhatsApp}
                        className="btn btn-success"
                        style={{ 
                          backgroundColor: '#25d366', 
                          border: 'none',
                          padding: '8px 16px'
                        }}
                      >
                        <i className="fab fa-whatsapp me-2"></i>
                        WhatsApp
                      </button>
                    </div>
                  </div>
                </div>

                {/* Related Jobs */}
                {relatedJobs.length > 0 && (
                  <div className="related-jobs">
                    <div className="title-box">
                      <h3>Related Jobs</h3>
                      <div className="text">
                        Similar cleaning opportunities
                      </div>
                    </div>
                    
                    {relatedJobs.map((relJob) => (
                      <div key={relJob.id} className="job-block">
                        <div className="inner-box">
                          <div className="content">
                            <span className="company-logo">
                              <img
                                width={50}
                                height={49}
                                src={relJob.company_logo || FALLBACK_LOGO}
                                alt="company"
                                onError={(e) => {
                                  e.currentTarget.src = FALLBACK_LOGO;
                                }}
                              />
                            </span>
                            <h4>
                              <a 
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleRelatedJobClick(relJob);
                                }}
                              >
                                {relJob.title}
                              </a>
                            </h4>
                            <ul className="job-info">
                              <li>
                                <span className="icon flaticon-map-locator"></span>
                                {relJob.city || relJob.location || "Location TBD"}
                              </li>
                              <li>
                                <span className="icon flaticon-money"></span>
                                £{relJob.hourly_rate || "TBD"}/hr
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="text-center mt-4">
                      <a href="/jobs" className="theme-btn btn-style-three">
                        View More Jobs
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div className="sidebar-column col-lg-4 col-md-12 col-sm-12">
                <aside className="sidebar">
                  <div className="sidebar-widget">
                    <h4 className="widget-title">Job Overview</h4>
                    <div className="widget-content">
                      <ul className="job-overview">
                        <li>
                          <i className="icon icon-calendar"></i>
                          <h5>Date Posted:</h5>
                          <span>{job?.created_at ? new Date(job.created_at).toLocaleDateString() : "Recently"}</span>
                        </li>
                        <li>
                          <i className="icon icon-location"></i>
                          <h5>Location:</h5>
                          <span>{getLocation()}</span>
                        </li>
                        <li>
                          <i className="icon icon-clock"></i>
                          <h5>Hours Required:</h5>
                          <span>{job?.hours_required || "Flexible"} hours</span>
                        </li>
                        <li>
                          <i className="icon icon-calendar"></i>
                          <h5>Work Date:</h5>
                          <span>{job?.date || "Flexible"}</span>
                        </li>
                      </ul>
                    </div>

                    {/* Map Widget - No API key required */}
               {/* Map Widget - No API key needed */}
              <h4 className="widget-title mt-5">Job Location</h4>
              <div className="widget-content">
                <div className="map-outer">
                  <div 
                    style={{ 
                      position: 'relative',
                      height: "250px", 
                      background: "#f5f5f5",
                      borderRadius: "8px",
                      overflow: 'hidden'
                    }}
                  >
                    {/* Dynamic Map Preview by address */}
                    <iframe
                      title="job-location-map"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://www.google.com/maps?q=${encodeURIComponent(getLocation())}&output=embed`}
                    />
                    {/* Overlay label (optional) */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      pointerEvents: 'none',
                      background: 'rgba(0,0,0,0.08)'
                    }}>
                      <div style={{
                        position: 'absolute', left: 0, right: 0, bottom: 8,
                        display: 'flex', justifyContent: 'center'
                      }}>
                        <span style={{ 
                          color: '#fff', fontWeight: 'bold',
                          textShadow: '0 1px 3px rgba(0,0,0,.6)' 
                        }}>
                          {getLocation()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button 
                    className="theme-btn btn-style-three w-100 mt-3"
                    onClick={openInGoogleMaps}
                  >
                    <i className="la la-map-marker me-2"></i>
                    View on Google Maps
                  </button>
                </div>
              </div>


                    {/* Required Skills */}
                    {job?.service_names && job.service_names.length > 0 && (
                      <>
                        <h4 className="widget-title mt-5">Services Required</h4>
                        <div className="widget-content">
                          <ul className="job-skills">
                            {job.service_names.map((skill, i) => (
                              <li key={i}>
                                <a href="#">{skill}</a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Employer Widget - Only show if logged in AND employer data exists */}
                  {isLoggedIn && employer ? (
                    <div className="sidebar-widget company-widget">
                      <div className="widget-content">
                        <div className="company-title">
                          <div className="company-logo">
                            <Image
                              width={54}
                              height={53}
                              src={getCompanyLogo()}
                              alt="company"
                              onError={(e) => {
                                e.currentTarget.src = FALLBACK_LOGO;
                              }}
                            />
                          </div>
                          <h5 className="company-name">{getCompanyName()}</h5>
                        </div>

                        <ul className="company-info">
                          {employer?.location && (
                            <li>Location: <span>{employer.location}</span></li>
                          )}
                          {employer?.user?.email && (
                            <li>Email: <span>{employer.user.email}</span></li>
                          )}
                          {employer?.user?.phone_number && (
                            <li>Phone: <span>{employer.user.phone_number}</span></li>
                          )}
                          {employer?.user?.address && (
                            <li>Address: <span>{employer.user.address}</span></li>
                          )}
                        </ul>
                      </div>
                    </div>
                  ) : !isLoggedIn ? (
                    <div className="sidebar-widget">
                      <div className="widget-content text-center" style={{ 
                        padding: "30px", 
                        background: "#f9fafb",
                        borderRadius: "8px"
                      }}>
                        <i className="icon la la-lock" style={{ fontSize: "48px", color: "#1967d2" }}></i>
                        <h5 style={{ marginTop: "15px", marginBottom: "10px" }}>
                          Employer Details Hidden
                        </h5>
                        <p style={{ color: "#666", marginBottom: "20px" }}>
                          Login to view contact information
                        </p>
                        <a href="/login" className="theme-btn btn-style-one w-100">
                          Login Now
                        </a>
                      </div>
                    </div>
                  ) : null}
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

export default dynamic(() => Promise.resolve(JobSingleDynamicV1), {
  ssr: false,
});