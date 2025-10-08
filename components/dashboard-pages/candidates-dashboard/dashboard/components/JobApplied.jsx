import Link from "next/link";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyApplications } from '@/store/slices/jobsSlice';

const JobApplied = () => {
  const dispatch = useDispatch();
  const { myApplications, applicationsLoading } = useSelector(state => state.jobs);

  useEffect(() => {
    dispatch(fetchMyApplications());
  }, [dispatch]);

  // Get status label and color
  const getStatusLabel = (status) => {
    switch(status) {
      case 'p': return { label: 'Pending', color: '#f59e0b' };
      case 'a': return { label: 'Accepted', color: '#10b981' };
      case 'r': return { label: 'Rejected', color: '#ef4444' };
      default: return { label: 'Unknown', color: '#6b7280' };
    }
  };

  if (applicationsLoading) {
    return <div>Loading applied jobs...</div>;
  }

  return (
    <>
      <div className="widget-title">
        <h4>Jobs Applied Recently ({myApplications.length})</h4>
      </div>
      
      <div className="widget-content">
        <div className="table-outer">
          <table className="default-table manage-job-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Date Applied</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {myApplications.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>
                    No jobs applied yet
                  </td>
                </tr>
              ) : (
                myApplications.map((application) => {
                  const statusInfo = getStatusLabel(application.status);
                  return (
                    <tr key={application.application_id}>
                      <td>
                        <div className="job-block">
                          <div className="inner-box">
                            <div className="content">
                              <span className="company-logo">
                                <div 
                                  style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '4px',
                                    backgroundColor: '#f0f5ff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#1967d2',
                                    fontSize: '20px',
                                    fontWeight: 'bold'
                                  }}
                                >
                                  {application.job_title ? 
                                    application.job_title.charAt(0).toUpperCase() : 
                                    <span className="flaticon-briefcase"></span>
                                  }
                                </div>
                              </span>
                              <h4>
                                <Link href={`/job-single-v1/${application.job}`}>
                                  {application.job_title || 'Untitled Job'}
                                </Link>
                              </h4>
                              <ul className="job-info">
                                <li>
                                  <span className="icon flaticon-briefcase"></span>
                                  {application.employer_name || 'Employer'}
                                </li>
                                {application.cover_letter && (
                                  <li title={application.cover_letter}>
                                    <span className="icon flaticon-paper-plane"></span>
                                    {application.cover_letter.substring(0, 30)}...
                                  </li>
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{application.date_applied || 'N/A'}</td>
                      <td>
                        <span 
                          className="badge"
                          style={{ 
                            backgroundColor: statusInfo.color,
                            color: '#fff',
                            padding: '4px 12px',
                            borderRadius: '4px'
                          }}
                        >
                          {statusInfo.label}
                        </span>
                      </td>
                      <td>
                        <div className="option-box">
                          <ul className="option-list">
                            <li>
                              <Link 
                                href={`/job-single-v1/${application.job}`}
                                onClick={() => {
                                  // Store application info for the job page
                                  localStorage.setItem('currentApplication', JSON.stringify(application));
                                }}
                              >
                                <span className="la la-eye"></span>
                              </Link>
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
    </>
  );
};

export default JobApplied;