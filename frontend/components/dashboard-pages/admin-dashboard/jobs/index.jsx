'use client';

import { useEffect, useState } from 'react';
import AdminService from '@/services/adminService';
import { toast } from 'react-toastify';
import JobsList from './components/JobsList';
import JobDetailsModal from './components/JobDetailsModal';
import DeleteJobModal from './components/DeleteJobModal';

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, [filterStatus]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = {};
      
      // Map frontend status to backend status codes
      const statusMap = {
        'open': 'o',
        'pending': 'p',
        'taken': 't',
        'in_progress': 'ip',
        'completed': 'c',
        'cancelled': 'ca'
      };
      
      if (filterStatus !== 'all') {
        params.status = statusMap[filterStatus] || filterStatus;
      }
      
      const data = await AdminService.getAllJobs(params);
      
      // Handle different response formats
      let jobsList = [];
      if (Array.isArray(data)) {
        jobsList = data;
      } else if (data && data.results) {
        jobsList = data.results;
      } else if (data && typeof data === 'object') {
        jobsList = data.data || [];
      }
      
      setJobs(jobsList);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
      toast.error(err.response?.data?.detail || err.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleViewClick = (job) => {
    setSelectedJob(job);
    setShowDetailsModal(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await AdminService.deleteJob(deleteId);
      toast.success('Job deleted successfully');
      setShowDeleteModal(false);
      setDeleteId(null);
      fetchJobs();
    } catch (err) {
      toast.error('Failed to delete job');
    }
  };

  const filteredJobs = jobs.filter((job) => {
    if (!searchTerm) return true;
    
    const search = searchTerm.toLowerCase();
    return (
      job.title?.toLowerCase().includes(search) ||
      job.description?.toLowerCase().includes(search) ||
      job.location?.toLowerCase().includes(search) ||
      job.employer_name?.toLowerCase().includes(search)
    );
  });

  return (
    <>
      <div className="admin-jobs">
        <div className="page-header">
          <div>
            <h2>Jobs Management</h2>
            <p className="subtitle">Monitor and manage all job postings</p>
          </div>
          <div className="header-actions">
            <div className="search-box">
              <span className="la la-search"></span>
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="btn-refresh" onClick={fetchJobs}>
              <span className="la la-sync"></span>
              Refresh
            </button>
          </div>
        </div>

        <div className="filters-section">
          <button 
            className={filterStatus === 'all' ? 'active' : ''} 
            onClick={() => setFilterStatus('all')}
          >
            <span className="la la-list"></span>
            All Jobs
          </button>
          <button 
            className={filterStatus === 'open' ? 'active' : ''} 
            onClick={() => setFilterStatus('open')}
          >
            <span className="la la-door-open"></span>
            Open
          </button>
          <button 
            className={filterStatus === 'pending' ? 'active' : ''} 
            onClick={() => setFilterStatus('pending')}
          >
            <span className="la la-clock"></span>
            Pending
          </button>
          <button 
            className={filterStatus === 'taken' ? 'active' : ''} 
            onClick={() => setFilterStatus('taken')}
          >
            <span className="la la-user-check"></span>
            Taken
          </button>
          <button 
            className={filterStatus === 'in_progress' ? 'active' : ''} 
            onClick={() => setFilterStatus('in_progress')}
          >
            <span className="la la-spinner"></span>
            In Progress
          </button>
          <button 
            className={filterStatus === 'completed' ? 'active' : ''} 
            onClick={() => setFilterStatus('completed')}
          >
            <span className="la la-check-circle"></span>
            Completed
          </button>
        </div>

        <JobsList
          jobs={filteredJobs}
          loading={loading}
          searchTerm={searchTerm}
          onView={handleViewClick}
          onDelete={handleDeleteClick}
        />
      </div>

      {showDetailsModal && (
        <JobDetailsModal
          job={selectedJob}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedJob(null);
          }}
        />
      )}

      {showDeleteModal && (
        <DeleteJobModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
        />
      )}

      <style jsx>{`
        .admin-jobs {
          padding: 30px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
          gap: 20px;
        }

        .page-header h2 {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 4px 0;
        }

        .subtitle {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }

        .header-actions {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .search-box {
          position: relative;
          width: 280px;
        }

        .search-box input {
          width: 100%;
          height: 44px;
          padding: 0 16px 0 44px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          font-size: 14px;
          transition: all 0.2s;
        }

        .search-box input:focus {
          outline: none;
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }

        .search-box .la-search {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          font-size: 18px;
        }

        .btn-refresh {
          height: 44px;
          padding: 0 20px;
          border: 1px solid #e5e7eb;
          background: white;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
          color: #4b5563;
        }

        .btn-refresh:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }

        .btn-refresh .la {
          font-size: 16px;
        }

        .filters-section {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .filters-section button {
          height: 44px;
          padding: 0 20px;
          border: 1px solid #e5e7eb;
          background: white;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          color: #4b5563;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .filters-section button:hover {
          border-color: #8b5cf6;
          color: #8b5cf6;
          background: #faf5ff;
        }

        .filters-section button.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: transparent;
          color: white;
        }

        .filters-section button .la {
          font-size: 16px;
        }

        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            align-items: stretch;
          }

          .header-actions {
            flex-direction: column;
          }

          .search-box {
            width: 100%;
          }

          .filters-section {
            flex-direction: column;
          }

          .filters-section button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
};

export default AdminJobs;
