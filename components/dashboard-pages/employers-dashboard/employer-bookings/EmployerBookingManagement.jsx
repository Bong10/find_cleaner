"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchBookings,
  processPayment,
  completeBooking,
  reviewCleaner,
  getSavedPaymentMethods,
  removeSavedPaymentMethod,
  clearMessages,
} from "@/store/slices/bookingSlice";

const EmployerBookingManagement = () => {
  const dispatch = useDispatch();
  
  // Safe selector with fallback
  const bookingState = useSelector((state) => state.bookings || {});
  const { 
    bookings = [], 
    loading = false, 
    error = null, 
    successMessage = null,
    savedPaymentMethods = []
  } = bookingState;
  
  const { user } = useSelector((state) => state.auth || {});
  
  const [activeTab, setActiveTab] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    method: "card",
    reference: "",
    saveDetails: false,
    useSaved: false,
    savedMethodId: null,
  });
  const [review, setReview] = useState({ rating: 5, comment: "" });
  
  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "Flexible";
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount || 0);
  };
  
  useEffect(() => {
    dispatch(fetchBookings());
    dispatch(getSavedPaymentMethods());
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
  
  const handlePayment = () => {
    if (!selectedBooking) return;
    
    let paymentRef = paymentData.reference;
    
    // Use saved payment method if selected
    if (paymentData.useSaved && paymentData.savedMethodId) {
      const savedMethod = savedPaymentMethods.find(
        (m) => m.id === paymentData.savedMethodId
      );
      if (savedMethod) {
        paymentRef = savedMethod.reference;
      }
    }
    
    if (!paymentRef.trim()) {
      toast.error("Please enter a payment reference");
      return;
    }
    
    dispatch(
      processPayment({
        bookingId: selectedBooking.booking_id,
        paymentReference: paymentRef,
        paymentMethod: paymentData.method,
        saveDetails: paymentData.saveDetails,
      })
    );
    
    setShowPaymentModal(false);
    resetPaymentData();
  };
  
  const handleComplete = (bookingId) => {
    if (window.confirm("Mark this job as completed? This will close the job and allow reviews.")) {
      dispatch(completeBooking(bookingId));
    }
  };
  
  const handleReviewSubmit = () => {
    if (!selectedBooking || !review.rating) {
      toast.error("Please provide a rating");
      return;
    }
    
    dispatch(
      reviewCleaner({
        bookingId: selectedBooking.booking_id,
        rating: review.rating,
        comment: review.comment,
      })
    );
    
    setShowReviewModal(false);
    setReview({ rating: 5, comment: "" });
    setSelectedBooking(null);
  };
  
  const resetPaymentData = () => {
    setPaymentData({
      method: "card",
      reference: "",
      saveDetails: false,
      useSaved: false,
      savedMethodId: null,
    });
    setSelectedBooking(null);
  };
  
  const getStatusDisplay = (booking) => {
    const statusMap = {
      'p': { 
        text: booking.paid_at ? "Paid" : (booking.cleaner_confirmed ? "Awaiting Payment" : "Pending Cleaner"), 
        class: booking.cleaner_confirmed ? "awaiting-payment" : "pending",
        icon: booking.cleaner_confirmed ? "la-credit-card" : "la-user-clock",
        description: booking.cleaner_confirmed ? "Cleaner confirmed. Process payment to proceed." : "Waiting for cleaner to accept the booking."
      },
      'cf': { 
        text: "Confirmed & Active", 
        class: "confirmed",
        icon: "la-check-circle",
        description: "Job is active. Mark as complete when finished."
      },
      'cp': { 
        text: "Completed", 
        class: "completed",
        icon: "la-trophy",
        description: "Job completed successfully."
      },
      'r': { 
        text: "Rejected", 
        class: "rejected",
        icon: "la-times-circle",
        description: "Booking was rejected."
      },
    };
    
    return statusMap[booking.status] || { 
      text: booking.status_display || "Unknown", 
      class: "", 
      icon: "la-question-circle",
      description: "Status unknown."
    };
  };
  
  const canReview = (booking) => {
    return booking.status === "cp" && !booking.cleaner_review;
  };
  
  const filteredBookings = Array.isArray(bookings) ? bookings.filter((booking) => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return booking.status === "p";
    if (activeTab === "active") return booking.status === "cf";
    if (activeTab === "completed") return booking.status === "cp";
    return true;
  }) : [];
  
  // Calculate stats
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'p').length,
    active: bookings.filter(b => b.status === 'cf').length,
    completed: bookings.filter(b => b.status === 'cp').length,
    awaitingPayment: bookings.filter(b => b.status === 'p' && b.cleaner_confirmed && !b.paid_at).length
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
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 35px;
        }
        
        .stat-card {
          background: white;
          padding: 25px;
          border-radius: 12px;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
        }
        
        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(76, 154, 153, 0.15);
          border-color: #4C9A99;
        }
        
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, #4C9A99 0%, #6BB3B2 100%);
        }
        
        .stat-card.warning::before {
          background: linear-gradient(90deg, #ff9800 0%, #ffa726 100%);
        }
        
        .stat-card.success::before {
          background: linear-gradient(90deg, #4caf50 0%, #66bb6a 100%);
        }
        
        .stat-card.info::before {
          background: linear-gradient(90deg, #2196f3 0%, #42a5f5 100%);
        }
        
        .stat-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .stat-info {
          flex: 1;
        }
        
        .stat-value {
          font-size: 32px;
          font-weight: 700;
          color: #202124;
          margin-bottom: 5px;
          line-height: 1;
        }
        
        .stat-label {
          font-size: 13px;
          color: #696969;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          background: linear-gradient(135deg, rgba(76, 154, 153, 0.1) 0%, rgba(76, 154, 153, 0.05) 100%);
          color: #4C9A99;
        }
        
        .stat-card.warning .stat-icon {
          background: linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(255, 152, 0, 0.05) 100%);
          color: #ff9800;
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
        
        .tab-badge {
          display: inline-block;
          margin-left: 8px;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 700;
          background: rgba(255, 255, 255, 0.2);
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
        
        .booking-card::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 150px;
          height: 150px;
          background: radial-gradient(circle, rgba(76, 154, 153, 0.05) 0%, transparent 70%);
          border-radius: 50%;
          transform: translate(50px, -50px);
        }
        
        .booking-card:hover {
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }
        
        .booking-card-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 25px;
          padding-bottom: 20px;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .job-info {
          flex: 1;
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
          padding: 4px 10px;
          background: linear-gradient(135deg, #4C9A99 0%, #3d7e7d 100%);
          color: white;
          border-radius: 6px;
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
        
        .meta-item strong {
          color: #202124;
          font-weight: 600;
        }
        
        .status-section {
          text-align: right;
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
          margin-bottom: 8px;
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
        }
        
        .booking-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 25px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
        }
        
        .detail-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .detail-icon {
          width: 35px;
          height: 35px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          color: #4C9A99;
          font-size: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        
        .detail-text {
          flex: 1;
        }
        
        .detail-label {
          font-size: 11px;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .detail-value {
          font-size: 14px;
          color: #202124;
          font-weight: 600;
        }
        
        .booking-actions {
          display: flex;
          gap: 12px;
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
        
        .btn-payment {
          background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
          color: white;
          animation: shimmer 3s infinite;
        }
        
        @keyframes shimmer {
          0%, 100% { box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3); }
          50% { box-shadow: 0 4px 20px rgba(33, 150, 243, 0.5); }
        }
        
        .btn-success {
          background: linear-gradient(135deg, #66bb6a 0%, #4caf50 100%);
          color: white;
        }
        
        .btn-warning {
          background: linear-gradient(135deg, #ffa726 0%, #ff9800 100%);
          color: white;
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
        }
        
        .payment-info {
          background: linear-gradient(135deg, rgba(33, 150, 243, 0.1), rgba(33, 150, 243, 0.05));
          padding: 15px 20px;
          border-radius: 8px;
          color: #1976d2;
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 500;
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
          max-width: 550px;
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
          margin-bottom: 10px;
          color: #202124;
        }
        
        .modal-subtitle {
          color: #696969;
          font-size: 14px;
          margin-bottom: 25px;
        }
        
        .payment-amount {
          text-align: center;
          padding: 25px;
          background: linear-gradient(135deg, rgba(76, 154, 153, 0.1), rgba(76, 154, 153, 0.05));
          border-radius: 12px;
          margin-bottom: 25px;
        }
        
        .payment-amount-label {
          font-size: 12px;
          color: #696969;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }
        
        .payment-amount-value {
          font-size: 36px;
          font-weight: 700;
          color: #4C9A99;
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
        }
        
        .form-input, .form-select {
          width: 100%;
          padding: 12px 15px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.3s;
        }
        
        .form-input:focus, .form-select:focus {
          outline: none;
          border-color: #4C9A99;
          box-shadow: 0 0 0 3px rgba(76, 154, 153, 0.1);
        }
        
        .payment-methods {
          display: grid;
          gap: 12px;
          margin-bottom: 20px;
        }
        
        .payment-method-card {
          border: 2px solid #e4e4e4;
          border-radius: 10px;
          padding: 15px;
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
        }
        
        .payment-method-card:hover {
          border-color: #4C9A99;
          background: rgba(76, 154, 153, 0.02);
        }
        
        .payment-method-card.selected {
          border-color: #4C9A99;
          background: linear-gradient(135deg, rgba(76, 154, 153, 0.1), rgba(76, 154, 153, 0.05));
        }
        
        .payment-method-card.selected::after {
          content: '✓';
          position: absolute;
          top: 10px;
          right: 10px;
          width: 24px;
          height: 24px;
          background: #4C9A99;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }
        
        .payment-method-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .payment-icon {
          font-size: 28px;
          color: #4C9A99;
        }
        
        .payment-method-details {
          flex: 1;
        }
        
        .payment-method-name {
          font-weight: 600;
          color: #202124;
          margin-bottom: 4px;
        }
        
        .payment-method-ref {
          font-size: 12px;
          color: #696969;
        }
        
        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 15px;
        }
        
        .checkbox-group input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }
        
        .checkbox-group label {
          font-size: 14px;
          color: #696969;
          cursor: pointer;
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
          box-shadow: 0 0 0 3px rgba(76, 154, 153, 0.1);
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
          <h1 className="booking-title">Booking Management</h1>
          <p className="booking-subtitle">
            Manage your cleaner bookings, process payments, and track job completion
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <div className="stat-value">{stats.total}</div>
                <div className="stat-label">Total Bookings</div>
              </div>
              <div className="stat-icon">
                <i className="la la-calendar-check"></i>
              </div>
            </div>
          </div>
          
          <div className="stat-card warning">
            <div className="stat-content">
              <div className="stat-info">
                <div className="stat-value">{stats.awaitingPayment}</div>
                <div className="stat-label">Awaiting Payment</div>
              </div>
              <div className="stat-icon">
                <i className="la la-credit-card"></i>
              </div>
            </div>
          </div>
          
          <div className="stat-card success">
            <div className="stat-content">
              <div className="stat-info">
                <div className="stat-value">{stats.active}</div>
                <div className="stat-label">Active Jobs</div>
              </div>
              <div className="stat-icon">
                <i className="la la-sync"></i>
              </div>
            </div>
          </div>
          
          <div className="stat-card info">
            <div className="stat-content">
              <div className="stat-info">
                <div className="stat-value">{stats.completed}</div>
                <div className="stat-label">Completed</div>
              </div>
              <div className="stat-icon">
                <i className="la la-trophy"></i>
              </div>
            </div>
          </div>
        </div>
        
        <div className="tabs">
          <button
            className={`tab ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All Bookings
            {stats.total > 0 && <span className="tab-badge">{stats.total}</span>}
          </button>
          <button
            className={`tab ${activeTab === "pending" ? "active" : ""}`}
            onClick={() => setActiveTab("pending")}
          >
            Pending
            {stats.pending > 0 && <span className="tab-badge">{stats.pending}</span>}
          </button>
          <button
            className={`tab ${activeTab === "active" ? "active" : ""}`}
            onClick={() => setActiveTab("active")}
          >
            Active
            {stats.active > 0 && <span className="tab-badge">{stats.active}</span>}
          </button>
          <button
            className={`tab ${activeTab === "completed" ? "active" : ""}`}
            onClick={() => setActiveTab("completed")}
          >
            Completed
            {stats.completed > 0 && <span className="tab-badge">{stats.completed}</span>}
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
                ? "Book cleaners for your jobs to see them here"
                : `No ${activeTab} bookings at the moment`}
            </p>
          </div>
        ) : (
          <div className="bookings-list">
            {filteredBookings.map((booking) => {
              const status = getStatusDisplay(booking);
              return (
                <div key={booking.booking_id} className="booking-card">
                  <div className="booking-card-header">
                    <div className="job-info">
                      <h3>
                        <span className="job-number">ID #{booking.booking_id}</span>
                        {booking.job_title || "Untitled Job"}
                      </h3>
                      <div className="job-meta">
                        <div className="meta-item">
                          <i className="la la-user"></i>
                          <strong>Cleaner:</strong> {booking.cleaner_name || "Not assigned"}
                        </div>
                        {booking.job && (
                          <div className="meta-item">
                            <i className="la la-briefcase"></i>
                            <strong>Job:</strong> #{booking.job}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="status-section">
                      <span className={`status-badge ${status.class}`}>
                        <i className={`la ${status.icon}`}></i>
                        {status.text}
                      </span>
                      <div className="status-description">{status.description}</div>
                    </div>
                  </div>
                  
                  {/* Booking Details */}
                  {(booking.payment_reference || booking.paid_at) && (
                    <div className="booking-details">
                      {booking.payment_reference && (
                        <div className="detail-item">
                          <div className="detail-icon">
                            <i className="la la-receipt"></i>
                          </div>
                          <div className="detail-text">
                            <div className="detail-label">Payment Reference</div>
                            <div className="detail-value">{booking.payment_reference}</div>
                          </div>
                        </div>
                      )}
                      {booking.paid_at && (
                        <div className="detail-item">
                          <div className="detail-icon">
                            <i className="la la-calendar-check"></i>
                          </div>
                          <div className="detail-text">
                            <div className="detail-label">Paid Date</div>
                            <div className="detail-value">{formatDate(booking.paid_at)}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="booking-actions">
                    {/* Pay button - show when cleaner confirmed but not paid */}
                    {booking.status === "p" && booking.cleaner_confirmed && !booking.paid_at && (
                      <>
                        <div className="payment-info">
                          <i className="la la-info-circle"></i>
                          Cleaner confirmed! Process payment to secure booking.
                        </div>
                        <button
                          className="action-btn btn-payment"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowPaymentModal(true);
                          }}
                        >
                          <i className="la la-credit-card"></i>
                          Process Payment
                        </button>
                      </>
                    )}
                    
                    {/* Waiting for cleaner */}
                    {booking.status === "p" && !booking.cleaner_confirmed && (
                      <div className="status-message">
                        <i className="la la-user-clock"></i>
                        Waiting for cleaner to confirm booking...
                      </div>
                    )}
                    
                    {/* Complete button */}
                    {booking.status === "cf" && (
                      <button
                        className="action-btn btn-success"
                        onClick={() => handleComplete(booking.booking_id)}
                      >
                        <i className="la la-check-circle"></i>
                        Mark as Complete
                      </button>
                    )}
                    
                    {/* Review button */}
                    {canReview(booking) && (
                      <button
                        className="action-btn btn-warning"
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowReviewModal(true);
                        }}
                      >
                        <i className="la la-star"></i>
                        Review Cleaner
                      </button>
                    )}
                    
                    {/* Completed status */}
                    {booking.status === "cp" && (
                      <div className="status-message" style={{ 
                        background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.1), rgba(156, 39, 176, 0.05))',
                        color: '#9c27b0' 
                      }}>
                        <i className="la la-trophy"></i>
                        Job completed successfully
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Payment Modal */}
        {showPaymentModal && selectedBooking && (
          <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2 className="modal-title">Process Payment</h2>
              <p className="modal-subtitle">
                Complete payment to confirm {selectedBooking.cleaner_name} for this job
              </p>
              
              <div className="payment-amount">
                <div className="payment-amount-label">Total Amount</div>
                <div className="payment-amount-value">
                  {/* You can add amount calculation here based on job details */}
                  £150.00
                </div>
              </div>
              
              {savedPaymentMethods.length > 0 && (
                <div className="form-group">
                  <label className="form-label">Saved Payment Methods</label>
                  <div className="payment-methods">
                    {savedPaymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className={`payment-method-card ${
                          paymentData.savedMethodId === method.id ? "selected" : ""
                        }`}
                        onClick={() =>
                          setPaymentData({
                            ...paymentData,
                            useSaved: true,
                            savedMethodId: method.id,
                          })
                        }
                      >
                        <div className="payment-method-info">
                          <i className="la la-credit-card payment-icon"></i>
                          <div className="payment-method-details">
                            <div className="payment-method-name">
                              {method.method.toUpperCase()}
                            </div>
                            <div className="payment-method-ref">
                              {method.reference}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {!paymentData.useSaved && (
                <>
                  <div className="form-group">
                    <label className="form-label">Payment Method</label>
                    <select
                      className="form-select"
                      value={paymentData.method}
                      onChange={(e) =>
                        setPaymentData({ ...paymentData, method: e.target.value })
                      }
                    >
                      <option value="card">Credit/Debit Card</option>
                      <option value="paypal">PayPal</option>
                      <option value="stripe">Stripe</option>
                      <option value="bank">Bank Transfer</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Payment Reference</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g., STRIPE-PI-12345 or transaction ID"
                      value={paymentData.reference}
                      onChange={(e) =>
                        setPaymentData({ ...paymentData, reference: e.target.value })
                      }
                    />
                  </div>
                  
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="savePayment"
                      checked={paymentData.saveDetails}
                      onChange={(e) =>
                        setPaymentData({ ...paymentData, saveDetails: e.target.checked })
                      }
                    />
                    <label htmlFor="savePayment">Save payment method for future use</label>
                  </div>
                </>
              )}
              
              <div className="modal-actions">
                <button
                  className="action-btn"
                  style={{ background: 'linear-gradient(135deg, #e0e0e0, #bdbdbd)', color: '#696969' }}
                  onClick={() => {
                    setShowPaymentModal(false);
                    resetPaymentData();
                  }}
                >
                  Cancel
                </button>
                <button className="action-btn btn-primary" onClick={handlePayment}>
                  Confirm Payment
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Review Modal */}
        {showReviewModal && selectedBooking && (
          <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2 className="modal-title">Review Cleaner</h2>
              <p className="modal-subtitle">
                Rate your experience with {selectedBooking.cleaner_name}
              </p>
              
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
                <label className="form-label">Your Feedback</label>
                <textarea
                  className="form-textarea"
                  placeholder="Share your experience with this cleaner..."
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

export default EmployerBookingManagement;