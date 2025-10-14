"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchBookings,
  confirmBooking,
  reviewEmployer,
  clearMessages,
} from "@/store/slices/bookingSlice";

const CleanerBookingManagement = () => {
  const dispatch = useDispatch();
  
  // Safe selector with fallback
  const bookingState = useSelector((state) => state.bookings || {});
  const { 
    bookings = [], 
    loading = false, 
    error = null, 
    successMessage = null 
  } = bookingState;
  
  const { user } = useSelector((state) => state.auth || {});
  
  const [activeTab, setActiveTab] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [review, setReview] = useState({ rating: 5, comment: "" });
  
  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "Flexible";
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };
  
  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);
  
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearMessages());
      dispatch(fetchBookings());
    }
    if (error) {
      toast.error(error);
      dispatch(clearMessages());
    }
  }, [successMessage, error, dispatch]);
  
  const handleConfirmBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to confirm this booking?")) {
      dispatch(confirmBooking(bookingId));
    }
  };
  
  const handleReviewSubmit = () => {
    if (!selectedBooking || !review.rating) {
      toast.error("Please provide a rating");
      return;
    }
    
    dispatch(
      reviewEmployer({
        bookingId: selectedBooking.booking_id,
        rating: review.rating,
        comment: review.comment,
      })
    );
    
    setShowReviewModal(false);
    setReview({ rating: 5, comment: "" });
    setSelectedBooking(null);
  };
  
  const getStatusDisplay = (booking) => {
    // FIXED: Proper status handling based on the booking state
    if (booking.status === 'cp') {
      return { 
        text: "Completed", 
        class: "completed", 
        icon: "la-trophy",
        description: "Job completed successfully" 
      };
    }
    
    if (booking.status === 'cf') {
      return { 
        text: "Confirmed & Paid", 
        class: "confirmed", 
        icon: "la-check-circle",
        description: "Job is active and paid - ready to start work" 
      };
    }
    
    if (booking.status === 'r') {
      return { 
        text: "Rejected", 
        class: "rejected", 
        icon: "la-times-circle",
        description: "Booking was rejected" 
      };
    }
    
    if (booking.status === 'p') {
      // Pending status - check different states
      if (booking.paid_at) {
        // This shouldn't happen, but just in case
        return { 
          text: "Processing", 
          class: "confirmed", 
          icon: "la-sync",
          description: "Payment being processed" 
        };
      }
      
      if (booking.cleaner_confirmed) {
        // Cleaner confirmed but not paid yet
        return { 
          text: "Awaiting Payment", 
          class: "awaiting-payment", 
          icon: "la-clock",
          description: "You've confirmed. Waiting for employer to pay." 
        };
      }
      
      // Not confirmed by cleaner yet
      return { 
        text: "Pending Your Confirmation", 
        class: "pending", 
        icon: "la-hourglass-half",
        description: "Employer wants to book you. Please confirm." 
      };
    }
    
    // Fallback to whatever the API provides
    return { 
      text: booking.status_display || "Unknown", 
      class: "", 
      icon: "la-question-circle",
      description: "Status unknown" 
    };
  };
  
  const canReview = (booking) => {
    return booking.status === "cp" && !booking.employer_review;
  };
  
  const filteredBookings = Array.isArray(bookings) ? bookings.filter((booking) => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") {
      // Show bookings that need cleaner action OR awaiting payment
      return booking.status === "p";
    }
    if (activeTab === "confirmed") {
      // Only show confirmed & paid jobs
      return booking.status === "cf";
    }
    if (activeTab === "completed") {
      // Show completed jobs
      return booking.status === "cp";
    }
    return true;
  }) : [];
  
  // Calculate proper stats
  const stats = {
    total: bookings.length,
    pendingAction: bookings.filter(b => b.status === 'p' && !b.cleaner_confirmed).length,
    awaitingPayment: bookings.filter(b => b.status === 'p' && b.cleaner_confirmed).length,
    confirmed: bookings.filter(b => b.status === 'cf').length,
    completed: bookings.filter(b => b.status === 'cp').length,
  };
  
  return (
    <>
      <style jsx>{`
        .booking-container {
          padding: 40px 30px;
          background: transparent;
          min-height: 500px;
        }
        
        .booking-header {
          margin-bottom: 35px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        }
        
        .booking-title {
          font-size: 26px;
          font-weight: 700;
          color: #202124;
          margin-bottom: 8px;
        }
        
        .booking-subtitle {
          color: #696969;
          font-size: 15px;
          line-height: 1.5;
        }
        
        .stats-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 35px;
        }
        
        .stat-card {
          background: linear-gradient(135deg, #4C9A99 0%, #3d7e7d 100%);
          padding: 25px;
          border-radius: 12px;
          color: white;
          position: relative;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(76, 154, 153, 0.2);
          transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(76, 154, 153, 0.3);
        }
        
        .stat-card::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          animation: shimmer 3s infinite;
        }
        
        @keyframes shimmer {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .stat-icon {
          font-size: 28px;
          margin-bottom: 10px;
          opacity: 0.9;
        }
        
        .stat-value {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 5px;
        }
        
        .stat-label {
          font-size: 14px;
          opacity: 0.9;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .tabs {
          display: flex;
          gap: 15px;
          margin-bottom: 35px;
          padding: 5px;
          background: #f8f9fa;
          border-radius: 10px;
          overflow-x: auto;
        }
        
        .tab {
          padding: 12px 24px;
          background: transparent;
          border: none;
          color: #696969;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.3s;
          white-space: nowrap;
          position: relative;
        }
        
        .tab:hover {
          color: #4C9A99;
          background: rgba(76, 154, 153, 0.05);
        }
        
        .tab.active {
          color: white;
          background: linear-gradient(135deg, #4C9A99 0%, #3d7e7d 100%);
          box-shadow: 0 4px 15px rgba(76, 154, 153, 0.3);
        }
        
        .booking-card {
          background: white;
          border-radius: 12px;
          padding: 30px;
          margin-bottom: 25px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          transition: all 0.3s;
          border: 1px solid rgba(0, 0, 0, 0.05);
          position: relative;
          overflow: hidden;
        }
        
        .booking-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(180deg, #4C9A99 0%, #3d7e7d 100%);
          opacity: 0;
          transition: opacity 0.3s;
        }
        
        .booking-card:hover {
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }
        
        .booking-card:hover::before {
          opacity: 1;
        }
        
        .booking-card-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 25px;
          padding-bottom: 20px;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .job-info h3 {
          font-size: 20px;
          font-weight: 700;
          color: #202124;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .job-number {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          background: linear-gradient(135deg, #4C9A99 0%, #3d7e7d 100%);
          color: white;
          border-radius: 50%;
          font-size: 12px;
          font-weight: 600;
        }
        
        .job-meta {
          display: flex;
          gap: 25px;
          flex-wrap: wrap;
        }
        
        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #696969;
          font-size: 14px;
        }
        
        .meta-item i {
          color: #4C9A99;
          font-size: 18px;
        }
        
        .status-badge {
          padding: 8px 16px;
          border-radius: 25px;
          font-size: 13px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          text-transform: capitalize;
        }
        
        .status-badge i {
          font-size: 16px;
        }
        
        .status-badge.pending {
          background: linear-gradient(135deg, #ffa726, #ff9800);
          color: white;
        }
        
        .status-badge.awaiting-payment {
          background: linear-gradient(135deg, #42a5f5, #2196f3);
          color: white;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3); }
          50% { box-shadow: 0 4px 20px rgba(33, 150, 243, 0.5); }
        }
        
        .status-badge.confirmed {
          background: linear-gradient(135deg, #66bb6a, #4caf50);
          color: white;
        }
        
        .status-badge.completed {
          background: linear-gradient(135deg, #ab47bc, #9c27b0);
          color: white;
        }
        
        .status-badge.rejected {
          background: linear-gradient(135deg, #ef5350, #f44336);
          color: white;
        }
        
        .status-description {
          font-size: 12px;
          color: #999;
          font-style: italic;
          margin-top: 5px;
        }
        
        .booking-actions {
          display: flex;
          gap: 12px;
          margin-top: 25px;
          padding-top: 25px;
          border-top: 1px solid #f0f0f0;
          align-items: center;
          flex-wrap: wrap;
        }
        
        .action-btn {
          padding: 12px 24px;
          border-radius: 8px;
          border: none;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        
        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #4C9A99 0%, #3d7e7d 100%);
          color: white;
        }
        
        .btn-primary:hover {
          background: linear-gradient(135deg, #3d7e7d 0%, #2d5e5d 100%);
        }
        
        .btn-success {
          background: linear-gradient(135deg, #66bb6a 0%, #4caf50 100%);
          color: white;
        }
        
        .btn-success:hover {
          background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
        }
        
        .btn-warning {
          background: linear-gradient(135deg, #ffa726 0%, #ff9800 100%);
          color: white;
        }
        
        .btn-warning:hover {
          background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
        }
        
        .status-message {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: linear-gradient(135deg, rgba(76, 154, 153, 0.1), rgba(76, 154, 153, 0.05));
          border-radius: 8px;
          color: #4C9A99;
          font-size: 14px;
          font-weight: 500;
        }
        
        .status-message i {
          font-size: 20px;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        
        .empty-state {
          text-align: center;
          padding: 80px 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }
        
        .empty-icon {
          font-size: 80px;
          color: #4C9A99;
          margin-bottom: 25px;
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .empty-text {
          color: #696969;
          font-size: 18px;
          margin-bottom: 10px;
        }
        
        .empty-subtext {
          color: #999;
          font-size: 14px;
        }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          backdrop-filter: blur(5px);
          animation: fadeIn 0.3s;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .modal-content {
          background: white;
          border-radius: 16px;
          padding: 35px;
          max-width: 500px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.3s;
        }
        
        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .modal-title {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 25px;
          color: #202124;
        }
        
        .form-group {
          margin-bottom: 25px;
        }
        
        .form-label {
          display: block;
          margin-bottom: 10px;
          font-weight: 600;
          color: #202124;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .rating-stars {
          display: flex;
          gap: 12px;
          font-size: 36px;
        }
        
        .star {
          cursor: pointer;
          color: #e0e0e0;
          transition: all 0.2s;
        }
        
        .star:hover {
          transform: scale(1.2);
        }
        
        .star.active {
          color: #ffc107;
          animation: starPop 0.3s;
        }
        
        @keyframes starPop {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
        
        .form-textarea {
          width: 100%;
          padding: 12px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          resize: vertical;
          min-height: 120px;
          font-size: 14px;
          transition: border-color 0.3s;
        }
        
        .form-textarea:focus {
          outline: none;
          border-color: #4C9A99;
        }
        
        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 30px;
        }
        
        .loading {
          text-align: center;
          padding: 60px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }
        
        .spinner {
          border: 4px solid rgba(76, 154, 153, 0.1);
          border-top: 4px solid #4C9A99;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .loading-text {
          color: #696969;
          font-size: 16px;
        }
      `}</style>
      
      <div className="booking-container">
        <div className="booking-header">
          <h1 className="booking-title">My Bookings</h1>
          <p className="booking-subtitle">
            Manage your booking requests, track confirmed jobs, and build your reputation through client reviews
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="la la-calendar-check"></i>
            </div>
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Bookings</div>
          </div>
          <div className="stat-card" style={{ background: 'linear-gradient(135deg, #ffa726 0%, #ff9800 100%)' }}>
            <div className="stat-icon">
              <i className="la la-hourglass-half"></i>
            </div>
            <div className="stat-value">
              {stats.pendingAction}
            </div>
            <div className="stat-label">Need Your Action</div>
          </div>
          <div className="stat-card" style={{ background: 'linear-gradient(135deg, #66bb6a 0%, #4caf50 100%)' }}>
            <div className="stat-icon">
              <i className="la la-check-circle"></i>
            </div>
            <div className="stat-value">
              {stats.confirmed}
            </div>
            <div className="stat-label">Active Jobs</div>
          </div>
          <div className="stat-card" style={{ background: 'linear-gradient(135deg, #ab47bc 0%, #9c27b0 100%)' }}>
            <div className="stat-icon">
              <i className="la la-trophy"></i>
            </div>
            <div className="stat-value">
              {stats.completed}
            </div>
            <div className="stat-label">Completed</div>
          </div>
        </div>
        
        <div className="tabs">
          <button
            className={`tab ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All Bookings
          </button>
          <button
            className={`tab ${activeTab === "pending" ? "active" : ""}`}
            onClick={() => setActiveTab("pending")}
          >
            Pending
          </button>
          <button
            className={`tab ${activeTab === "confirmed" ? "active" : ""}`}
            onClick={() => setActiveTab("confirmed")}
          >
            Active Jobs
          </button>
          <button
            className={`tab ${activeTab === "completed" ? "active" : ""}`}
            onClick={() => setActiveTab("completed")}
          >
            Completed
          </button>
        </div>
        
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p className="loading-text">Loading your bookings...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <i className="la la-calendar-times"></i>
            </div>
            <p className="empty-text">No bookings found</p>
            <p className="empty-subtext">
              {activeTab === "all" 
                ? "Your bookings will appear here once employers book your services"
                : `No ${activeTab} bookings at the moment`}
            </p>
          </div>
        ) : (
          <div className="bookings-list">
            {filteredBookings.map((booking, index) => {
              const status = getStatusDisplay(booking);
              return (
                <div key={booking.booking_id} className="booking-card">
                  <div className="booking-card-header">
                    <div className="job-info">
                      <h3>
                        <span className="job-number">#{booking.booking_id}</span>
                        {booking.job_title || "Untitled Job"}
                      </h3>
                      <div className="job-meta">
                        <div className="meta-item">
                          <i className="la la-building"></i>
                          {booking.employer_name || "Employer"}
                        </div>
                        {booking.payment_reference && (
                          <div className="meta-item">
                            <i className="la la-credit-card"></i>
                            Payment: {booking.payment_reference}
                          </div>
                        )}
                        {booking.paid_at && (
                          <div className="meta-item">
                            <i className="la la-check-square"></i>
                            Paid: {formatDate(booking.paid_at)}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className={`status-badge ${status.class}`}>
                        <i className={`la ${status.icon}`}></i>
                        {status.text}
                      </span>
                      <div className="status-description">{status.description}</div>
                    </div>
                  </div>
                  
                  <div className="booking-actions">
                    {/* Confirm booking button - only show if pending and not confirmed by cleaner */}
                    {booking.status === "p" && !booking.cleaner_confirmed && (
                      <button
                        className="action-btn btn-success"
                        onClick={() => handleConfirmBooking(booking.booking_id)}
                      >
                        <i className="la la-check"></i>
                        Confirm Booking
                      </button>
                    )}
                    
                    {/* Waiting for payment - show if cleaner confirmed but not paid */}
                    {booking.status === "p" && booking.cleaner_confirmed && !booking.paid_at && (
                      <div className="status-message" style={{ 
                        background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1), rgba(33, 150, 243, 0.05))',
                        color: '#2196f3' 
                      }}>
                        <i className="la la-clock"></i>
                        You've confirmed. Awaiting employer payment...
                      </div>
                    )}
                    
                    {/* Job confirmed and paid */}
                    {booking.status === "cf" && (
                      <div className="status-message" style={{ 
                        background: 'linear-gradient(135deg, rgba(102, 187, 106, 0.1), rgba(76, 175, 80, 0.05))', 
                        color: '#4caf50' 
                      }}>
                        <i className="la la-check-circle"></i>
                        Job active! Payment received - ready to start work
                      </div>
                    )}
                    
                    {/* Job completed */}
                    {booking.status === "cp" && (
                      <div className="status-message" style={{ 
                        background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.1), rgba(156, 39, 176, 0.05))',
                        color: '#9c27b0' 
                      }}>
                        <i className="la la-trophy"></i>
                        Job completed successfully!
                      </div>
                    )}
                    
                    {/* Leave review - only for completed jobs */}
                    {canReview(booking) && (
                      <button
                        className="action-btn btn-warning"
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowReviewModal(true);
                        }}
                      >
                        <i className="la la-star"></i>
                        Review Employer
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Review Modal */}
        {showReviewModal && (
          <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2 className="modal-title">Review Employer</h2>
              
              <div className="form-group">
                <label className="form-label">Rating</label>
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star ${review.rating >= star ? "active" : ""}`}
                      onClick={() => setReview({ ...review, rating: star })}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Your Experience</label>
                <textarea
                  className="form-textarea"
                  placeholder="Share your experience working with this employer..."
                  value={review.comment}
                  onChange={(e) => setReview({ ...review, comment: e.target.value })}
                />
              </div>
              
              <div className="modal-actions">
                <button
                  className="action-btn"
                  style={{ background: 'linear-gradient(135deg, #e0e0e0, #bdbdbd)', color: '#696969' }}
                  onClick={() => {
                    setShowReviewModal(false);
                    setReview({ rating: 5, comment: "" });
                  }}
                >
                  Cancel
                </button>
                <button className="action-btn btn-primary" onClick={handleReviewSubmit}>
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CleanerBookingManagement;