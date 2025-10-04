import Link from "next/link";
import { useEffect, useState } from 'react';
import { getJobs } from '@/services/cleanerService';

const JobApplied = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  const fetchAppliedJobs = async () => {
    try {
      const response = await getJobs();
      console.log('Jobs response:', response);
      
      // Use ALL jobs from /api/jobs/ as applied jobs
      const jobs = response?.data || [];
      setAppliedJobs(jobs);
      
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading applied jobs...</div>;
  }

  return (
    <>
      <div className="widget-title">
        <h4>Jobs Applied Recently ({appliedJobs.length})</h4>
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
              {appliedJobs.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>
                    No jobs applied yet
                  </td>
                </tr>
              ) : (
                appliedJobs.map((job) => (
                  <tr key={job.job_id}>
                    <td>
                      <div className="job-block">
                        <div className="inner-box">
                          <div className="content">
                            <span className="company-logo">
                              {job.employer_logo || job.company_logo || job.image ? (
                                <img 
                                  src={job.employer_logo || job.company_logo || job.image} 
                                  alt="company" 
                                  style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextElementSibling.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <div 
                                style={{
                                  width: '50px',
                                  height: '50px',
                                  borderRadius: '4px',
                                  backgroundColor: '#f0f5ff',
                                  display: job.employer_logo || job.company_logo || job.image ? 'none' : 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: '#1967d2',
                                  fontSize: '20px',
                                  fontWeight: 'bold'
                                }}
                              >
                                {job.employer_name ? 
                                  job.employer_name.charAt(0).toUpperCase() : 
                                  <span className="flaticon-briefcase"></span>
                                }
                              </div>
                            </span>
                            <h4>
                              <Link href={`/job-single-v3/${job.job_id}`}>
                                {job.title}
                              </Link>
                            </h4>
                            <ul className="job-info">
                              <li>
                                <span className="icon flaticon-briefcase"></span>
                                {job.employer_name || 'Company'}
                              </li>
                              <li>
                                <span className="icon flaticon-map-locator"></span>
                                {job.location}
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{new Date(job.created_at).toLocaleDateString()}</td>
                    <td className="status">{job.status === 'o' ? 'Open' : job.status}</td>
                    <td>
                      <div className="option-box">
                        <ul className="option-list">
                          <li>
                            <Link href={`/job-single-v3/${job.job_id}`}>
                              <span className="la la-eye"></span>
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default JobApplied;