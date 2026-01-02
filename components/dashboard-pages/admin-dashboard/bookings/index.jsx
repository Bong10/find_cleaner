'use client';

import { useEffect, useState } from 'react';
import AdminService from '@/services/adminService';
import { toast } from 'react-toastify';
import BookingsList from './components/BookingsList';
import BookingDetailsModal from './components/BookingDetailsModal';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, [filterStatus]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = {};
      
      // Map frontend status to backend status codes
      const statusMap = {
        'pending': 'p',
        'confirmed': 'cf',
        'completed': 'cp',
        'rejected': 'r'
      };
      
      if (filterStatus !== 'all') {
        params.status = statusMap[filterStatus] || filterStatus;
      }
      
      const data = await AdminService.getAllBookings(params);
      
      // Handle different response formats
      let bookingsList = [];
      if (Array.isArray(data)) {
        bookingsList = data;
      } else if (data && data.results) {
        bookingsList = data.results;
      } else if (data && typeof data === 'object') {
        bookingsList = data.data || [];
      }
      
      setBookings(bookingsList);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      toast.error(err.response?.data?.detail || err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleViewClick = async (booking) => {
    try {
      // Try different ID property names
      const bookingId = booking.id || booking.booking_id || booking.pk;
      
      if (!bookingId) {
        toast.error('Unable to load booking details - missing ID');
        return;
      }
      
      const fullBooking = await AdminService.getBookingById(bookingId);
      setSelectedBooking(fullBooking);
      setShowDetailsModal(true);
    } catch (err) {
      console.error('Error loading booking details:', err);
      toast.error('Failed to load booking details');
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (!searchTerm) return true;
    
    const search = searchTerm.toLowerCase();
    return (
      booking.job_title?.toLowerCase().includes(search) ||
      booking.cleaner_name?.toLowerCase().includes(search) ||
      booking.employer_name?.toLowerCase().includes(search) ||
      booking.id?.toString().includes(search)
    );
  });

  return (
    <>
      <div className="admin-bookings">
        <div className="page-header">
          <div>
            <h2>Bookings Management</h2>
            <p className="subtitle">Monitor and manage all job bookings</p>
          </div>
          <div className="header-actions">
            <div className="search-box">
              <span className="la la-search"></span>
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="btn-refresh" onClick={fetchBookings}>
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
            All Bookings
          </button>
          <button 
            className={filterStatus === 'pending' ? 'active' : ''} 
            onClick={() => setFilterStatus('pending')}
          >
            <span className="la la-clock"></span>
            Pending
          </button>
          <button 
            className={filterStatus === 'confirmed' ? 'active' : ''} 
            onClick={() => setFilterStatus('confirmed')}
          >
            <span className="la la-check-circle"></span>
            Confirmed
          </button>
          <button 
            className={filterStatus === 'completed' ? 'active' : ''} 
            onClick={() => setFilterStatus('completed')}
          >
            <span className="la la-badge-check"></span>
            Completed
          </button>
          <button 
            className={filterStatus === 'rejected' ? 'active' : ''} 
            onClick={() => setFilterStatus('rejected')}
          >
            <span className="la la-times-circle"></span>
            Rejected
          </button>
        </div>

        <BookingsList
          bookings={filteredBookings}
          loading={loading}
          searchTerm={searchTerm}
          onView={handleViewClick}
        />
      </div>

      {showDetailsModal && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedBooking(null);
          }}
          onRefresh={fetchBookings}
        />
      )}

      <style jsx>{`
        .admin-bookings {
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
          .admin-bookings {
            padding: 20px;
          }

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
            overflow-x: auto;
            flex-wrap: nowrap;
          }
        }
      `}</style>
    </>
  );
};

export default AdminBookings;
