import React from 'react';

const ServicesList = ({ services, loading, searchTerm, onEdit, onDelete }) => {
  if (loading) {
    return (
      <>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading services...</p>
        </div>
        <style jsx>{`
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
        `}</style>
      </>
    );
  }

  return (
    <>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Category</th>
              <th>Base Price</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                  {searchTerm ? 'No services found matching your search' : 'No services created yet'}
                </td>
              </tr>
            ) : (
              services.map((service) => (
                <tr key={service.id}>
                  <td>#{service.id}</td>
                  <td>{service.name}</td>
                  <td>{service.description?.substring(0, 60)}{service.description?.length > 60 ? '...' : ''}</td>
                  <td>
                    <span className="category-badge">
                      {service.category_name || 'N/A'}
                    </span>
                  </td>
                  <td>${service.min_hourly_rate || '0'}</td>
                  <td>{service.created_at ? new Date(service.created_at).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-edit"
                        onClick={() => onEdit(service)}
                        title="Edit"
                      >
                        <span className="la la-edit"></span>
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => onDelete(service.id)}
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

      <style jsx>{`
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

        .category-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          text-transform: capitalize;
          background: #dbeafe;
          color: #1e40af;
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

        .btn-edit {
          background: #dbeafe;
          color: #1d4ed8;
        }

        .btn-edit:hover {
          background: #bfdbfe;
        }

        .btn-delete {
          background: #fee2e2;
          color: #dc2626;
        }

        .btn-delete:hover {
          background: #fecaca;
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

export default ServicesList;
