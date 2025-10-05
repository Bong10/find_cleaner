"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import ConfirmModal, { useConfirm } from "../../../../common/ConfirmModal";
import { 
  loadShortlist, 
  removeFromShortlist,
  selectShortlist 
} from "@/store/slices/shortlistSlice";
import { getJob } from "@/services/jobsService";

const JobFavouriteTable = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { items: shortlistedJobs, status, error } = useSelector(selectShortlist);
  const [filter, setFilter] = useState("all"); // all, active, expired
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [jobDetails, setJobDetails] = useState({});
  const { confirmState, confirm, closeConfirm } = useConfirm();

  // Load shortlisted jobs on component mount
  useEffect(() => {
    dispatch(loadShortlist());
  }, [dispatch]);

  // Fetch job details for each shortlisted item
  useEffect(() => {
    const fetchJobs = async () => {
      const details = {};
      for (const item of shortlistedJobs) {
        if (item.job && !jobDetails[item.job]) {
          try {
            const { data } = await getJob(item.job);
            details[item.job] = data;
          } catch (error) {
            console.error(`Error fetching job ${item.job}:`, error);
          }
        }
      }
      if (Object.keys(details).length > 0) {
        setJobDetails(prev => ({ ...prev, ...details }));
      }
    };

    if (shortlistedJobs.length > 0) {
      fetchJobs();
    }
  }, [shortlistedJobs]);

  // Apply filter whenever jobs or filter changes
  useEffect(() => {
    let filtered = [...shortlistedJobs];
    
    if (filter === "active") {
      filtered = filtered.filter(item => {
        const jobStatus = item.job_status || item.status || 'active';
        return jobStatus.toLowerCase() === 'active';
      });
    } else if (filter === "expired") {
      filtered = filtered.filter(item => {
        const jobStatus = item.job_status || item.status || 'active';
        return jobStatus.toLowerCase() === 'expired' || jobStatus.toLowerCase() === 'filled';
      });
    }
    
    setFilteredJobs(filtered);
  }, [shortlistedJobs, filter]);

  const handleRemove = async (shortlistId, jobTitle) => {
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
    }
  };

  const handleViewDetails = (shortlistId) => {
    router.push(`/candidates-dashboard/short-listed-jobs?shortlist=${shortlistId}`);
  };

  const handleViewJob = (jobId) => {
    router.push(`/job-single-v3/${jobId}`);
  };

  const handleApply = (jobId) => {
    router.push(`/job-single-v3/${jobId}#apply`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getStatusBadge = (status) => {
    const jobStatus = status?.toLowerCase() || 'active';
    switch(jobStatus) {
      case 'active':
        return { 
          text: 'Active', 
          style: { background: '#e8f5e9', color: '#2e7d32' }
        };
      case 'expired':
        return { 
          text: 'Expired', 
          style: { background: '#ffebee', color: '#c62828' }
        };
      case 'filled':
        return { 
          text: 'Position Filled', 
          style: { background: '#fff3e0', color: '#ff9800' }
        };
      default:
        return { 
          text: 'Active', 
          style: { background: '#e8f5e9', color: '#2e7d32' }
        };
    }
  };

  // Helper to extract job details from the shortlist item
  const getJobDetails = (item) => {
    return {
      id: item.job || item.job_id,
      shortlistId: item.id,
      title: item.job_title || item.title || 'Cleaning Position',
      company: item.company || item.employer || { name: 'Company' },
      location: item.job_location || item.location,
      posted_date: item.posted_date || item.created_at,
      status: item.job_status || item.status || 'active',
      job_type: item.job_type,
      shortlisted_date: item.created_at,
    };
  };

  const isLoading = status === "loading" || status === "idle";

  // Get total count
  const totalCount = shortlistedJobs.length;
  const activeCount = shortlistedJobs.filter(item => {
    const jobStatus = item.job_status || item.status || 'active';
    return jobStatus.toLowerCase() === 'active';
  }).length;

  return (
    <>
      <div className="tabs-box">
        <div className="widget-title">
          <h4>
            My Shortlisted Jobs 
            <span style={{ 
              marginLeft: '10px',
              fontSize: '14px',
              fontWeight: 'normal',
              color: '#696969'
            }}>
              ({filteredJobs.length} {filter !== 'all' && `${filter} `}of {totalCount} total)
            </span>
          </h4>

          <div className="chosen-outer">
            <select 
              className="chosen-single form-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Jobs ({totalCount})</option>
              <option value="active">Active Jobs ({activeCount})</option>
              <option value="expired">Expired Jobs ({totalCount - activeCount})</option>
            </select>
          </div>
        </div>

        <div className="widget-content">
          <div className="table-outer">
            <table className="default-table manage-job-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Location</th>
                  <th>Hourly Rate</th>
                  <th>Shortlisted Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '50px' }}>
                      <div style={{ color: '#666' }}>
                        <i className="la la-spinner la-spin" style={{ fontSize: '32px', marginBottom: '10px' }}></i>
                        <p style={{ fontSize: '16px', margin: 0 }}>Loading shortlisted jobs...</p>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '60px 20px' }}>
                      <div style={{ 
                        maxWidth: '400px', 
                        margin: '0 auto',
                        textAlign: 'center'
                      }}>
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
                          <i className="la la-exclamation-triangle" style={{ 
                            fontSize: '40px', 
                            color: '#dc3545'
                          }}></i>
                        </div>
                        <h4 style={{ 
                          fontSize: '18px', 
                          fontWeight: '600',
                          color: '#333',
                          marginBottom: '10px'
                        }}>
                          Error Loading Jobs
                        </h4>
                        <p style={{ 
                          fontSize: '14px',
                          color: '#666',
                          lineHeight: '1.6',
                          marginBottom: '20px'
                        }}>
                          {error}
                        </p>
                        <button 
                          onClick={() => dispatch(loadShortlist())}
                          className="theme-btn btn-style-one"
                        >
                          <i className="la la-refresh" style={{ marginRight: '5px' }}></i>
                          Try Again
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : filteredJobs.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '60px 20px' }}>
                      <div style={{ 
                        maxWidth: '400px', 
                        margin: '0 auto',
                        textAlign: 'center'
                      }}>
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
                          <i className="la la-heart" style={{ 
                            fontSize: '40px', 
                            color: '#ff4d4f',
                            opacity: 0.7
                          }}></i>
                        </div>
                        <h4 style={{ 
                          fontSize: '18px', 
                          fontWeight: '600',
                          color: '#333',
                          marginBottom: '10px'
                        }}>
                          {filter === 'all' ? 'No Shortlisted Jobs Yet' : `No ${filter.charAt(0).toUpperCase() + filter.slice(1)} Jobs`}
                        </h4>
                        <p style={{ 
                          fontSize: '14px',
                          color: '#666',
                          lineHeight: '1.6',
                          marginBottom: '20px'
                        }}>
                          {filter === 'all' 
                            ? "You haven't shortlisted any jobs yet. Browse available positions and save the ones you're interested in!"
                            : `You don't have any ${filter} jobs in your shortlist.`
                          }
                        </p>
                        {filter === 'all' && (
                          <Link 
                            href="/job-list-v1" 
                            className="theme-btn btn-style-one"
                          >
                            <i className="la la-search" style={{ marginRight: '5px' }}></i>
                            Browse Jobs
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredJobs.map((item) => {
                    const job = getJobDetails(item);
                    const statusBadge = getStatusBadge(job.status);
                    const isExpired = job.status?.toLowerCase() === 'expired' || job.status?.toLowerCase() === 'filled';
                    const fullJobDetails = jobDetails[job.id];
                    const hourlyRate = fullJobDetails?.hourly_rate || 0;
                    
                    return (
                      <tr key={job.shortlistId} style={{ 
                        opacity: isExpired ? 0.7 : 1 
                      }}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{
                              width: '50px',
                              height: '50px',
                              borderRadius: '8px',
                              overflow: 'hidden',
                              flexShrink: 0
                            }}>
                              {job.company?.logo ? (
                                <img 
                                  src={job.company.logo} 
                                  alt={job.company.name}
                                  style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    objectFit: 'cover' 
                                  }}
                                />
                              ) : (
                                <div style={{
                                  width: '100%',
                                  height: '100%',
                                  background: '#f0f5ff',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}>
                                  <i className="la la-building" style={{ 
                                    fontSize: '24px', 
                                    color: '#1967d2' 
                                  }}></i>
                                </div>
                              )}
                            </div>
                            <div>
                              <h5 style={{ 
                                margin: '0 0 5px 0', 
                                fontSize: '15px',
                                fontWeight: '600'
                              }}>
                                <a 
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleViewDetails(job.shortlistId);
                                  }}
                                  style={{ 
                                    color: '#202124', 
                                    cursor: 'pointer',
                                    textDecoration: 'none'
                                  }}
                                >
                                  {job.title}
                                </a>
                              </h5>
                              <p style={{ 
                                margin: 0, 
                                color: '#696969',
                                fontSize: '14px'
                              }}>
                                {job.company?.name || 'Company Name'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ color: '#696969', fontSize: '14px' }}>
                            <i className="la la-map-marker" style={{ marginRight: '5px' }}></i>
                            {job.location || 'Location not specified'}
                          </div>
                        </td>
                        <td>
                          <div style={{ 
                            color: hourlyRate > 0 ? '#2e7d32' : '#696969', 
                            fontWeight: '600',
                            fontSize: '14px'
                          }}>
                            {hourlyRate > 0 ? `£${parseFloat(hourlyRate).toFixed(2)}/hour` : '—'}
                          </div>
                        </td>
                        <td>
                          <div style={{ color: '#696969', fontSize: '14px' }}>
                            {formatDate(job.shortlisted_date)}
                          </div>
                        </td>
                        <td>
                          <span style={{ 
                            padding: '5px 12px',
                            borderRadius: '15px',
                            fontSize: '13px',
                            fontWeight: '500',
                            display: 'inline-block',
                            ...statusBadge.style
                          }}>
                            {statusBadge.text}
                          </span>
                        </td>
                        <td>
                          <div className="option-box">
                            <ul className="option-list">
                              <li>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleViewDetails(job.shortlistId);
                                  }}
                                  data-text="View Details"
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(25, 103, 210, 0.1)';
                                    e.currentTarget.style.borderRadius = '4px';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'none';
                                  }}
                                  style={{ 
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '4px',
                                    transition: 'all 0.3s'
                                  }}
                                >
                                  <span className="la la-eye" style={{ color: '#1967d2', fontSize: '16px' }}></span>
                                </button>
                              </li>
                              {!isExpired && (
                                <li>
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleApply(job.id);
                                    }}
                                    data-text="Apply Now"
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.background = 'rgba(82, 196, 26, 0.1)';
                                      e.currentTarget.style.borderRadius = '4px';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.background = 'none';
                                    }}
                                    style={{ 
                                      background: 'none',
                                      border: 'none',
                                      cursor: 'pointer',
                                      padding: '4px',
                                      transition: 'all 0.3s'
                                    }}
                                  >
                                    <span className="la la-paper-plane" style={{ color: '#52c41a', fontSize: '16px' }}></span>
                                  </button>
                                </li>
                              )}
                              <li>
                                <button
                                  onClick={async (e) => {
                                    e.preventDefault();
                                    await handleRemove(job.shortlistId, job.title);
                                  }}
                                  data-text="Remove"
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 77, 79, 0.1)';
                                    e.currentTarget.style.borderRadius = '4px';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'none';
                                  }}
                                  style={{ 
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '4px',
                                    transition: 'all 0.3s'
                                  }}
                                >
                                  <span className="la la-trash" style={{ color: '#ff4d4f', fontSize: '16px' }}></span>
                                </button>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
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
};

export default JobFavouriteTable;

/* 
  Backend Integration Notes:
  
  Expected API endpoints:
  
  1. GET /api/cleaner/shortlisted-jobs
     Query params: { filter: 'all' | 'active' | 'expired' }
     Response: {
       data: [{
         id: number,
         job: number,
         job_title: string,
         company: {
           id: number,
           name: string,
           logo: string
         },
         location: string,
         hourly_rate: number,
         posted_date: string,
         status: 'active' | 'expired' | 'filled',
         job_type: string,
         created_at: string (shortlisted date)
       }]
     }
  
  2. DELETE /api/cleaner/shortlisted-jobs/:id
     Response: { success: boolean }
*/
