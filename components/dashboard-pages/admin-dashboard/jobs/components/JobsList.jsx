'use client';

import { useEffect, useState } from 'react';
import AdminService from '@/services/adminService';
import { toast } from 'react-toastify';

const JobsList = ({ jobs, loading, searchTerm, onView, onDelete }) => {
  if (loading) {
    return (
      <>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading jobs...</p>
        </div>

        <style jsx>{`
          .loading-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 100px 20px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }

          .spinner {
            width: 48px;
            height: 48px;
            border: 4px solid #f3f4f6;
            border-top-color: #8b5cf6;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin-bottom: 16px;
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }

          .loading-state p {
            margin: 0;
            color: #6b7280;
            font-size: 15px;
            font-weight: 500;
          }
        `}</style>
      </>
    );
  }

  if (jobs.length === 0) {
    return (
      <>
        <div className="empty-state">
          <span className="la la-briefcase"></span>
          <h3>No jobs found</h3>
          <p>{searchTerm ? 'Try adjusting your search criteria' : 'No jobs have been posted yet'}</p>
        </div>

        <style jsx>{`
          .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 100px 20px;
            text-align: center;
            background: white;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }

          .empty-state .la {
            font-size: 80px;
            color: #e5e7eb;
            margin-bottom: 20px;
          }

          .empty-state h3 {
            font-size: 24px;
            font-weight: 600;
            color: #1f2937;
            margin: 0 0 12px 0;
          }

          .empty-state p {
            font-size: 15px;
            color: #6b7280;
            margin: 0;
          }
        `}</style>
      </>
    );
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      'o': { label: 'Open', class: 'status-open' },
      'p': { label: 'Pending', class: 'status-pending' },
      't': { label: 'Taken', class: 'status-taken' },
      'ip': { label: 'In Progress', class: 'status-progress' },
      'c': { label: 'Completed', class: 'status-completed' },
      'ca': { label: 'Cancelled', class: 'status-cancelled' },
      // Also support full names for backwards compatibility
      'open': { label: 'Open', class: 'status-open' },
      'pending': { label: 'Pending', class: 'status-pending' },
      'taken': { label: 'Taken', class: 'status-taken' },
      'in_progress': { label: 'In Progress', class: 'status-progress' },
      'completed': { label: 'Completed', class: 'status-completed' },
      'cancelled': { label: 'Cancelled', class: 'status-cancelled' },
      'closed': { label: 'Closed', class: 'status-closed' },
    };
    const config = statusMap[status] || { label: status, class: 'status-default' };
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  return (
    <>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title & Services</th>
              <th>Employer</th>
              <th>Location</th>
              <th>Date</th>
              <th>Rate</th>
              <th>Status</th>
              <th>Applications</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>#{job.id}</td>
                <td>
                  <div className="job-title-cell">
                    <strong>{job.title}</strong>
                    {(job.services_display || job.services) && (
                      <small className="service-tags">
                        {(() => {
                          const services = job.services_display || job.services || [];
                          if (services.length === 0) return null;
                          const displayServices = services.slice(0, 2);
                          const remaining = services.length - 2;
                          return (
                            <>
                              {displayServices.join(', ')}
                              {remaining > 0 && ` +${remaining} more`}
                            </>
                          );
                        })()}
                      </small>
                    )}
                  </div>
                </td>
                <td>{job.employer_name || 'N/A'}</td>
                <td>{job.location || 'N/A'}</td>
                <td>{job.date ? new Date(job.date).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <strong>${job.hourly_rate || '0'}/hr</strong>
                  <small className="hours-info">{job.hours_required || 0}hrs</small>
                </td>
                <td>{getStatusBadge(job.status)}</td>
                <td>
                  <span className="applications-count">
                    {job.applications_count || 0}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-view"
                      onClick={() => onView(job)}
                      title="View Details"
                    >
                      <span className="la la-eye"></span>
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => onDelete(job.id)}
                      title="Delete"
                    >
                      <span className="la la-trash"></span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .table-container {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .data-table td {
          padding: 16px;
          border-top: 1px solid #f3f4f6;
          font-size: 14px;
          color: #374151;
        }

        .data-table tbody tr {
          transition: background 0.2s;
        }

        .data-table tbody tr:hover {
          background: #f9fafb;
        }

        .job-title-cell {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .job-title-cell strong {
          color: #1f2937;
          font-weight: 600;
          font-size: 14px;
        }

        .service-tags {
          display: inline-flex;
          align-items: center;
          font-size: 12px;
          color: #8b5cf6;
          background: #f3e8ff;
          padding: 3px 8px;
          border-radius: 6px;
          font-weight: 500;
          max-width: fit-content;
        }

        .hours-info {
          display: block;
          font-size: 12px;
          color: #6b7280;
          margin-top: 2px;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          text-transform: capitalize;
        }

        .status-open {
          background: #dbeafe;
          color: #1e40af;
        }

        .status-pending {
          background: #fef3c7;
          color: #92400e;
        }

        .status-taken {
          background: #e0e7ff;
          color: #4338ca;
        }

        .status-progress {
          background: #fef3c7;
          color: #92400e;
        }

        .status-completed {
          background: #d1fae5;
          color: #065f46;
        }

        .status-cancelled {
          background: #fee2e2;
          color: #991b1b;
        }

        .status-closed {
          background: #e5e7eb;
          color: #4b5563;
        }

        .status-default {
          background: #f3f4f6;
          color: #6b7280;
        }

        .applications-count {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 32px;
          height: 32px;
          padding: 0 8px;
          background: #f3f4f6;
          border-radius: 6px;
          font-weight: 600;
          color: #374151;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .btn-view,
        .btn-delete {
          width: 36px;
          height: 36px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          display: grid;
          place-items: center;
          font-size: 16px;
          transition: all 0.2s;
        }

        .btn-view {
          background: #eff6ff;
          color: #2563eb;
        }

        .btn-view:hover {
          background: #dbeafe;
          transform: translateY(-1px);
        }

        .btn-delete {
          background: #fef2f2;
          color: #dc2626;
        }

        .btn-delete:hover {
          background: #fee2e2;
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .table-container {
            overflow-x: auto;
          }

          .data-table {
            min-width: 800px;
          }
        }
      `}</style>
    </>
  );
};

export default JobsList;
