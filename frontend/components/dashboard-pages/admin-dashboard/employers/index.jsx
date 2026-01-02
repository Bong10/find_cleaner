'use client';

import { useEffect, useState } from 'react';
import AdminService from '@/services/adminService';
import { toast } from 'react-toastify';

const AdminEmployers = () => {
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployer, setSelectedEmployer] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchEmployers();
  }, []);

  const fetchEmployers = async () => {
    try {
      setLoading(true);
      const data = await AdminService.getAllEmployers();
      setEmployers(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error('Failed to fetch employers:', err);
      toast.error('Failed to load employers');
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (id) => {
    try {
      const employer = await AdminService.getEmployerById(id);
      setSelectedEmployer(employer);
      setShowViewModal(true);
    } catch (err) {
      toast.error('Failed to load employer details');
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await AdminService.deleteEmployer(deleteId);
      toast.success('Employer deleted successfully');
      setShowDeleteModal(false);
      setDeleteId(null);
      fetchEmployers();
    } catch (err) {
      toast.error('Failed to delete employer');
    }
  };

  const filteredEmployers = employers.filter((employer) => {
    const search = searchTerm.toLowerCase();
    const email = employer.user?.email || employer.email || '';
    const name = employer.user?.name || employer.name || employer.company_name || '';
    const phone = employer.user?.phone_number || employer.phone_number || '';
    
    return (
      email.toLowerCase().includes(search) ||
      name.toLowerCase().includes(search) ||
      phone.toLowerCase().includes(search)
    );
  });

  return (
    <div className="admin-employers">
      <div className="page-header">
        <div>
          <h2>Employers Management</h2>
          <p>Manage all registered employers</p>
        </div>
        <div className="header-actions">
          <div className="search-box">
            <span className="la la-search"></span>
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading employers...</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Name/Company</th>
                <th>Phone</th>
                <th>Profile Status</th>
                <th>Date Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployers.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                    {searchTerm ? 'No employers found matching your search' : 'No employers registered yet'}
                  </td>
                </tr>
              ) : (
                filteredEmployers.map((employer) => (
                  <tr key={employer.id}>
                    <td>#{employer.id}</td>
                    <td>{employer.user?.email || employer.email || 'N/A'}</td>
                    <td>{employer.company_name || employer.user?.name || employer.name || 'Not set'}</td>
                    <td>{employer.user?.phone_number || employer.phone_number || 'Not set'}</td>
                    <td>
                      <span className={`status-badge ${employer.user?.profile_completed || employer.profile_completed ? 'complete' : 'incomplete'}`}>
                        {employer.user?.profile_completed || employer.profile_completed ? 'Complete' : 'Incomplete'}
                      </span>
                    </td>
                    <td>{new Date(employer.created_at || employer.user?.date_joined).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-view"
                          onClick={() => handleView(employer.id)}
                          title="View Details"
                        >
                          <span className="la la-eye"></span>
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteClick(employer.id)}
                          title="Delete"
                        >
                          <span className="la la-trash"></span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedEmployer && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Employer Details</h3>
              <button className="close-btn" onClick={() => setShowViewModal(false)}>
                <span className="la la-times"></span>
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Email:</label>
                  <span>{selectedEmployer.user?.email || selectedEmployer.email || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <label>Name:</label>
                  <span>{selectedEmployer.user?.name || selectedEmployer.name || 'Not set'}</span>
                </div>
                <div className="detail-item">
                  <label>Company Name:</label>
                  <span>{selectedEmployer.company_name || 'Not set'}</span>
                </div>
                <div className="detail-item">
                  <label>Phone:</label>
                  <span>{selectedEmployer.user?.phone_number || selectedEmployer.phone_number || 'Not set'}</span>
                </div>
                <div className="detail-item">
                  <label>Gender:</label>
                  <span>{selectedEmployer.user?.gender || selectedEmployer.gender || 'Not set'}</span>
                </div>
                <div className="detail-item">
                  <label>Address:</label>
                  <span>{selectedEmployer.user?.address || selectedEmployer.address || 'Not set'}</span>
                </div>
                <div className="detail-item">
                  <label>Profile Status:</label>
                  <span className={`status-badge ${selectedEmployer.user?.profile_completed || selectedEmployer.profile_completed ? 'complete' : 'incomplete'}`}>
                    {selectedEmployer.user?.profile_completed || selectedEmployer.profile_completed ? 'Complete' : 'Incomplete'}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Company Size:</label>
                  <span>{selectedEmployer.company_size || 'Not specified'}</span>
                </div>
                <div className="detail-item full-width">
                  <label>Company Description:</label>
                  <span>{selectedEmployer.company_description || 'No description provided'}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowViewModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm Delete</h3>
              <button className="close-btn" onClick={() => setShowDeleteModal(false)}>
                <span className="la la-times"></span>
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this employer? This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="btn-danger" onClick={handleDeleteConfirm}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-employers {
          padding: 30px;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 30px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .page-header h2 {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 8px;
        }

        .page-header p {
          font-size: 15px;
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
          width: 320px;
        }

        .search-box span {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          font-size: 18px;
        }

        .search-box input {
          width: 100%;
          height: 44px;
          padding: 0 16px 0 44px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s;
        }

        .search-box input:focus {
          outline: none;
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }

        .loading-state {
          text-align: center;
          padding: 60px 20px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e5e7eb;
          border-top-color: #8b5cf6;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
          margin: 0 auto 16px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .table-container {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table thead {
          background: #f9fafb;
        }

        .data-table th {
          padding: 16px;
          text-align: left;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 2px solid #e5e7eb;
        }

        .data-table td {
          padding: 16px;
          font-size: 14px;
          color: #4b5563;
          border-bottom: 1px solid #f3f4f6;
        }

        .data-table tbody tr:hover {
          background: #f9fafb;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .status-badge.complete {
          background: #d1fae5;
          color: #065f46;
        }

        .status-badge.incomplete {
          background: #fee2e2;
          color: #991b1b;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .action-buttons button {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          display: grid;
          place-items: center;
          font-size: 16px;
          transition: all 0.2s;
        }

        .btn-view {
          background: #ede9fe;
          color: #6d28d9;
        }

        .btn-view:hover {
          background: #ddd6fe;
        }

        .btn-delete {
          background: #fee2e2;
          color: #dc2626;
        }

        .btn-delete:hover {
          background: #fecaca;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-content.small {
          max-width: 400px;
        }

        .modal-header {
          padding: 24px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-header h3 {
          font-size: 20px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .close-btn {
          width: 32px;
          height: 32px;
          border: none;
          background: #f3f4f6;
          border-radius: 6px;
          cursor: pointer;
          display: grid;
          place-items: center;
          font-size: 18px;
          color: #6b7280;
          transition: all 0.2s;
        }

        .close-btn:hover {
          background: #e5e7eb;
        }

        .modal-body {
          padding: 24px;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .detail-item.full-width {
          grid-column: 1 / -1;
        }

        .detail-item label {
          font-size: 13px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .detail-item span {
          font-size: 15px;
          color: #1f2937;
        }

        .modal-footer {
          padding: 20px 24px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        .btn-secondary,
        .btn-danger {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
        }

        .btn-secondary:hover {
          background: #e5e7eb;
        }

        .btn-danger {
          background: #dc2626;
          color: white;
        }

        .btn-danger:hover {
          background: #b91c1c;
        }

        @media (max-width: 768px) {
          .admin-employers {
            padding: 20px;
          }

          .page-header {
            flex-direction: column;
          }

          .search-box {
            width: 100%;
          }

          .table-container {
            overflow-x: auto;
          }

          .data-table {
            min-width: 800px;
          }

          .detail-grid {
            grid-template-columns: 1fr;
          }

          .detail-item.full-width {
            grid-column: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminEmployers;
