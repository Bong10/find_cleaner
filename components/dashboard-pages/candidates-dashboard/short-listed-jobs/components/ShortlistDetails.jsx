"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { fetchJobById, selectJobById, selectJobLoading } from "@/store/slices/jobsSlice";
import { removeFromShortlist, selectShortlist } from "@/store/slices/shortlistSlice";
import ConfirmModal, { useConfirm } from "../../../../common/ConfirmModal";

// inline SVG fallback for company logo
const DEFAULT_LOGO =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='50' height='49'>
       <rect width='100%' height='100%' rx='8' ry='8' fill='#F3F4F6'/>
       <text x='50%' y='58%' text-anchor='middle' font-size='20' fill='#9CA3AF'>🏢</text>
     </svg>`
  );

const fmtDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
};

const absolutize = (url) => {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
  const path = url.startsWith("/") ? url : `/${url}`;
  return base ? `${base}${path}` : url;
};

export default function ShortlistDetails() {
  const search = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const shortlistId = search.get("shortlist");
  const { confirmState, confirm, closeConfirm } = useConfirm();

  // Get shortlist items from Redux
  const { items: shortlistItems } = useSelector(selectShortlist);
  
  // Try to find the shortlisted item from Redux store
  const cached = useMemo(
    () => shortlistItems.find((x) => String(x.id) === String(shortlistId)),
    [shortlistItems, shortlistId]
  );

  const shortlistItem = cached || null;
  const jobId = shortlistItem?.job;
  
  // Get job from Redux store
  const job = useSelector(state => selectJobById(state, jobId));
  const loading = useSelector(state => selectJobLoading(state, jobId));
  const [error, setError] = useState("");

  // Fetch job details using Redux
  const jobFetched = useRef(false);
  useEffect(() => {
    if (!jobId || job || jobFetched.current) return;
    jobFetched.current = true;
    
    dispatch(fetchJobById(jobId))
      .unwrap()
      .catch((err) => {
        console.error("Error fetching job details:", err);
        setError(err.error || "Failed to load job details.");
      });
  }, [jobId, job, dispatch]);

  const handleRemove = async () => {
    const jobTitle = shortlistItem?.job_title || job?.title || "this job";
    
    const shouldRemove = await confirm({
      title: "Remove from Shortlist",
      message: `Are you sure you want to remove "${jobTitle}" from your shortlisted jobs?`,
      confirmText: "Remove",
      cancelText: "Cancel",
      confirmStyle: "danger",
      icon: "la-heart-broken"
    });

    if (shouldRemove) {
      dispatch(removeFromShortlist({ id: shortlistId }));
      router.push('/candidates-dashboard/short-listed-jobs');
    }
  };

  const handleApply = () => {
    if (jobId) router.push(`/job-single-v3/${jobId}#apply`);
  };

  const handleBack = () => router.push('/candidates-dashboard/short-listed-jobs');

  // Loading state
  if (loading) {
    return (
      <div className="ls-widget" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <i className="la la-spinner la-spin" style={{ fontSize: '48px', color: '#1967d2', marginBottom: '20px' }}></i>
          <h4 style={{ color: '#666' }}>Loading job details...</h4>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="ls-widget" style={{ padding: '60px 30px', textAlign: 'center' }}>
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 20px',
            background: '#fee',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <i className="la la-exclamation-triangle" style={{ fontSize: '40px', color: '#dc3545' }}></i>
          </div>
          <h3 style={{ marginBottom: '10px', fontSize: '20px' }}>Error Loading Details</h3>
          <p style={{ color: '#666', marginBottom: '20px' }}>{error}</p>
          <button onClick={handleBack} className="theme-btn btn-style-one">
            <i className="la la-arrow-left" style={{ marginRight: '5px' }}></i>
            Back to List
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!shortlistItem || !job) {
    return (
      <div className="ls-widget" style={{ padding: '60px 30px', textAlign: 'center' }}>
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          <h3 style={{ marginBottom: '10px', fontSize: '20px' }}>Shortlist Item Not Found</h3>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            This shortlisted job could not be found. It may have been removed.
          </p>
          <button onClick={handleBack} className="theme-btn btn-style-one">
            <i className="la la-arrow-left" style={{ marginRight: '5px' }}></i>
            Back to List
          </button>
        </div>
      </div>
    );
  }

  // Extract job details
  const title = job?.title || "Untitled Job";
  const description = job?.description || "";
  const location = job?.location || "—";
  const date = job?.date || null;
  const time = job?.time || "—";
  const rate = job?.hourly_rate ?? "—";
  const hours = job?.hours_required ?? "—";
  const requirements = job?.special_requirements || "";
  const services = job?.services || [];
  const employer = job?.employer || {};
  const employerName = employer?.company_name || employer?.user?.first_name || "Company";
  const employerLogo = absolutize(employer?.logo) || DEFAULT_LOGO;
  const postedDate = shortlistItem?.created_at || job?.created_at;
  const jobStatus = shortlistItem?.job_status || job?.status || 'active';
  const isExpired = jobStatus?.toLowerCase() === 'expired' || jobStatus?.toLowerCase() === 'filled';

  const totalCost = !isNaN(rate) && !isNaN(hours) ? (parseFloat(rate) * parseFloat(hours)).toFixed(2) : "—";

  return (
    <>
      <div className="ls-widget">
        <div className="widget-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4>
            Shortlisted Job Details
            {isExpired && (
              <span style={{ 
                marginLeft: '15px',
                padding: '5px 12px',
                background: '#ffebee',
                color: '#c62828',
                borderRadius: '15px',
                fontSize: '13px',
                fontWeight: '500'
              }}>
                {jobStatus === 'filled' ? 'Position Filled' : 'Expired'}
              </span>
            )}
          </h4>
          
          <Link href="/candidates-dashboard/short-listed-jobs" className="theme-btn btn-style-one">
            Back to Shortlisted Jobs
          </Link>
        </div>

        <div className="widget-content" style={{ padding: '30px' }}>
          {/* Job Header */}
          <div style={{ 
            borderBottom: '1px solid #e8e8e8', 
            paddingBottom: '25px', 
            marginBottom: '30px' 
          }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'start' }}>
              <img 
                src={employerLogo}
                alt={employerName}
                style={{ 
                  width: '80px', 
                  height: '80px', 
                  borderRadius: '8px',
                  objectFit: 'cover'
                }}
                onError={(e) => { e.target.src = DEFAULT_LOGO; }}
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ 
                  fontSize: '24px', 
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: '#202124'
                }}>
                  {title}
                </h3>
                <p style={{ 
                  fontSize: '16px',
                  color: '#696969',
                  marginBottom: '15px'
                }}>
                  {employerName}
                </p>
                <div style={{ 
                  display: 'flex', 
                  gap: '20px',
                  flexWrap: 'wrap',
                  fontSize: '14px',
                  color: '#696969'
                }}>
                  <span>
                    <i className="la la-map-marker" style={{ marginRight: '5px', color: '#1967d2' }}></i>
                    {location}
                  </span>
                  <span>
                    <i className="la la-calendar" style={{ marginRight: '5px', color: '#1967d2' }}></i>
                    {fmtDate(date)}
                  </span>
                  <span>
                    <i className="la la-clock" style={{ marginRight: '5px', color: '#1967d2' }}></i>
                    {time}
                  </span>
                  <span>
                    <i className="la la-bookmark" style={{ marginRight: '5px', color: '#1967d2' }}></i>
                    Shortlisted: {fmtDate(postedDate)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Information */}
          <div style={{ 
            background: '#f8fafb',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '30px'
          }}>
            <h5 style={{ 
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '15px',
              color: '#202124'
            }}>
              Pricing Details
            </h5>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div>
                <span style={{ color: '#696969', fontSize: '14px' }}>Hourly Rate</span>
                <p style={{ 
                  fontSize: '20px', 
                  fontWeight: '600',
                  color: '#2e7d32',
                  margin: '5px 0'
                }}>
                  £{typeof rate === 'number' ? rate.toFixed(2) : rate}/hour
                </p>
              </div>
              <div>
                <span style={{ color: '#696969', fontSize: '14px' }}>Hours Required</span>
                <p style={{ 
                  fontSize: '20px', 
                  fontWeight: '600',
                  color: '#202124',
                  margin: '5px 0'
                }}>
                  {hours} {hours === 1 ? 'hour' : 'hours'}
                </p>
              </div>
              <div>
                <span style={{ color: '#696969', fontSize: '14px' }}>Estimated Total</span>
                <p style={{ 
                  fontSize: '20px', 
                  fontWeight: '600',
                  color: '#1967d2',
                  margin: '5px 0'
                }}>
                  £{totalCost}
                </p>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div style={{ marginBottom: '30px' }}>
            <h5 style={{ 
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '15px',
              color: '#202124'
            }}>
              Job Description
            </h5>
            <div style={{ 
              color: '#696969',
              lineHeight: '1.8',
              fontSize: '14px'
            }}>
              {description || <em>No description provided.</em>}
            </div>
          </div>

          {/* Services Required */}
          {services.length > 0 && (
            <div style={{ marginBottom: '30px' }}>
              <h5 style={{ 
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '15px',
                color: '#202124'
              }}>
                Services Required
              </h5>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {services.map((service, idx) => (
                  <span 
                    key={idx}
                    style={{
                      padding: '6px 15px',
                      background: '#e3f2fd',
                      color: '#1967d2',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    {service.name || service}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Special Requirements */}
          {requirements && (
            <div style={{ marginBottom: '30px' }}>
              <h5 style={{ 
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '15px',
                color: '#202124'
              }}>
                Special Requirements
              </h5>
              <div style={{ 
                color: '#696969',
                lineHeight: '1.8',
                fontSize: '14px',
                padding: '15px',
                background: '#fff8e1',
                borderRadius: '8px',
                borderLeft: '4px solid #ffc107'
              }}>
                {requirements}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ 
            display: 'flex',
            gap: '15px',
            paddingTop: '20px',
            borderTop: '1px solid #e8e8e8'
          }}>
            {!isExpired && (
              <button 
                onClick={handleApply}
                className="theme-btn btn-style-one"
              >
                <i className="la la-paper-plane" style={{ marginRight: '5px' }}></i>
                Apply Now
              </button>
            )}
            <button 
              onClick={() => router.push(`/job-single-v3/${jobId}`)}
              className="theme-btn btn-style-two"
            >
              <i className="la la-eye" style={{ marginRight: '5px' }}></i>
              View Full Details
            </button>
            <button 
              onClick={handleRemove}
              className="theme-btn btn-style-three"
              style={{
                background: '#fff',
                color: '#dc3545',
                border: '1px solid #dc3545'
              }}
            >
              <i className="la la-trash" style={{ marginRight: '5px' }}></i>
              Remove from Shortlist
            </button>
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={closeConfirm}
        onConfirm={confirmState.onConfirm}
        title={confirmState.title}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
        confirmStyle={confirmState.confirmStyle}
        icon={confirmState.icon}
      />
    </>
  );
}