"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { processPayment, loadPaymentMethods } from "@/store/slices/bookingSlice";
import { toast } from "react-toastify";

const PaymentModal = ({ booking, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const paymentMethods = useSelector((state) => state.bookings.paymentMethods);
  
  const [paymentMethod, setPaymentMethod] = useState("new");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });
  const [saveCard, setSaveCard] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  const amount = (booking.job?.hourly_rate || 20) * (booking.job?.hours_required || 1);
  
  useEffect(() => {
    dispatch(loadPaymentMethods());
  }, [dispatch]);
  
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };
  
  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, "").length <= 16) {
      setCardDetails({ ...cardDetails, number: formatted });
    }
  };
  
  const handleExpiryChange = (field, value) => {
    if (value.length <= 2 && /^\d*$/.test(value)) {
      setCardDetails({ ...cardDetails, [field]: value });
    }
  };
  
  const handleCVVChange = (value) => {
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setCardDetails({ ...cardDetails, cvv: value });
    }
  };
  
  const validateCard = () => {
    if (paymentMethod !== "new" && paymentMethod !== "") {
      return true;
    }
    
    if (!cardDetails.number || cardDetails.number.replace(/\s/g, "").length < 16) {
      toast.error("Please enter a valid card number");
      return false;
    }
    
    if (!cardDetails.name) {
      toast.error("Please enter the cardholder name");
      return false;
    }
    
    if (!cardDetails.expiryMonth || !cardDetails.expiryYear) {
      toast.error("Please enter the expiry date");
      return false;
    }
    
    if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
      toast.error("Please enter a valid CVV");
      return false;
    }
    
    return true;
  };
  
  const handlePayment = async () => {
    if (!validateCard()) return;
    
    setProcessing(true);
    
    const paymentData = {
      amount,
      method: paymentMethod === "new" ? "card" : "saved_card",
      reference: `PAY-${Date.now()}`,
      saveCard,
      cardDetails: paymentMethod === "new" ? {
        number: cardDetails.number.replace(/\s/g, ""),
        name: cardDetails.name,
        expiryMonth: cardDetails.expiryMonth,
        expiryYear: cardDetails.expiryYear,
        brand: detectCardBrand(cardDetails.number),
      } : null,
      savedCardId: paymentMethod !== "new" ? paymentMethod : null,
    };
    
    const result = await dispatch(
      processPayment({
        bookingId: booking.booking_id,
        paymentData,
      })
    );
    
    if (processPayment.fulfilled.match(result)) {
      onSuccess();
      onClose();
    }
    
    setProcessing(false);
  };
  
  const detectCardBrand = (number) => {
    const cleanNumber = number.replace(/\s/g, "");
    if (/^4/.test(cleanNumber)) return "Visa";
    if (/^5[1-5]/.test(cleanNumber)) return "Mastercard";
    if (/^3[47]/.test(cleanNumber)) return "Amex";
    return "Card";
  };
  
  return (
    <>
      <style jsx>{`
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
        }
        
        .modal-content {
          background: white;
          border-radius: 16px;
          max-width: 500px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
        }
        
        .modal-header {
          padding: 25px 30px;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .modal-title {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 5px;
        }
        
        .modal-subtitle {
          color: #6b7280;
          font-size: 14px;
        }
        
        .modal-body {
          padding: 30px;
        }
        
        .payment-summary {
          background: #f9fafb;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 25px;
        }
        
        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        
        .summary-row:last-child {
          margin-bottom: 0;
          padding-top: 12px;
          border-top: 2px solid #e5e7eb;
        }
        
        .summary-label {
          color: #6b7280;
        }
        
        .summary-value {
          font-weight: 600;
          color: #1f2937;
        }
        
        .summary-total {
          font-size: 20px;
          color: #4C9A99;
        }
        
        .payment-methods {
          margin-bottom: 25px;
        }
        
        .method-label {
          font-weight: 600;
          color: #374151;
          margin-bottom: 12px;
        }
        
        .saved-cards {
          display: grid;
          gap: 10px;
          margin-bottom: 15px;
        }
        
        .card-option {
          padding: 15px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .card-option:hover {
          border-color: #4C9A99;
        }
        
        .card-option.selected {
          border-color: #4C9A99;
          background: rgba(76, 154, 153, 0.05);
        }
        
        .card-radio {
          width: 20px;
          height: 20px;
        }
        
        .card-info {
          flex: 1;
        }
        
        .card-brand {
          font-weight: 600;
          color: #1f2937;
        }
        
        .card-last4 {
          color: #6b7280;
          font-size: 14px;
        }
        
        .new-card-form {
          display: grid;
          gap: 20px;
        }
        
        .form-group {
          display: grid;
          gap: 8px;
        }
        
        .form-label {
          font-weight: 600;
          color: #374151;
          font-size: 14px;
        }
        
        .form-input {
          padding: 12px 15px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 15px;
          transition: all 0.3s ease;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #4C9A99;
          box-shadow: 0 0 0 3px rgba(76, 154, 153, 0.1);
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        
        .expiry-inputs {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        
        .expiry-input {
          width: 60px;
        }
        
        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .checkbox {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }
        
        .checkbox-label {
          color: #374151;
          cursor: pointer;
        }
        
        .modal-footer {
          padding: 20px 30px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }
        
        .btn {
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 15px;
        }
        
        .btn-cancel {
          background: #f3f4f6;
          color: #6b7280;
        }
        
        .btn-cancel:hover {
          background: #e5e7eb;
        }
        
        .btn-pay {
          background: #4C9A99;
          color: white;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .btn-pay:hover {
          background: #3a7877;
        }
        
        .btn-pay:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid white;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .security-notice {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 8px;
          margin-top: 20px;
        }
        
        .security-icon {
          color: #16a34a;
          font-size: 20px;
        }
        
        .security-text {
          color: #15803d;
          font-size: 13px;
        }
      `}</style>
      
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">Complete Payment</h2>
            <p className="modal-subtitle">
              Pay for booking #{booking.booking_id}
            </p>
          </div>
          
          <div className="modal-body">
            <div className="payment-summary">
              <div className="summary-row">
                <span className="summary-label">Job Title:</span>
                <span className="summary-value">{booking.job?.title}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Cleaner:</span>
                <span className="summary-value">
                  {booking.cleaner?.user?.first_name} {booking.cleaner?.user?.last_name}
                </span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Hourly Rate:</span>
                <span className="summary-value">£{booking.job?.hourly_rate || 20}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Hours:</span>
                <span className="summary-value">{booking.job?.hours_required || 1}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Total Amount:</span>
                <span className="summary-value summary-total">£{amount}</span>
              </div>
            </div>
            
            <div className="payment-methods">
              <div className="method-label">Payment Method</div>
              
              {paymentMethods.length > 0 && (
                <div className="saved-cards">
                  {paymentMethods.map((card) => (
                    <div
                      key={card.id}
                      className={`card-option ${paymentMethod === card.id ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod(card.id)}
                    >
                      <input
                        type="radio"
                        className="card-radio"
                        checked={paymentMethod === card.id}
                        onChange={() => setPaymentMethod(card.id)}
                      />
                      <div className="card-info">
                        <div className="card-brand">{card.brand}</div>
                        <div className="card-last4">•••• {card.last4}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div
                className={`card-option ${paymentMethod === 'new' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('new')}
              >
                <input
                  type="radio"
                  className="card-radio"
                  checked={paymentMethod === 'new'}
                  onChange={() => setPaymentMethod('new')}
                />
                <div className="card-info">
                  <div className="card-brand">Add New Card</div>
                </div>
              </div>
            </div>
            
            {paymentMethod === 'new' && (
              <div className="new-card-form">
                <div className="form-group">
                  <label className="form-label">Card Number</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.number}
                    onChange={handleCardNumberChange}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Cardholder Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="John Doe"
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Expiry Date</label>
                    <div className="expiry-inputs">
                      <input
                        type="text"
                        className="form-input expiry-input"
                        placeholder="MM"
                        value={cardDetails.expiryMonth}
                        onChange={(e) => handleExpiryChange('expiryMonth', e.target.value)}
                      />
                      <span>/</span>
                      <input
                        type="text"
                        className="form-input expiry-input"
                        placeholder="YY"
                        value={cardDetails.expiryYear}
                        onChange={(e) => handleExpiryChange('expiryYear', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">CVV</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="123"
                      value={cardDetails.cvv}
                      onChange={(e) => handleCVVChange(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="saveCard"
                    className="checkbox"
                    checked={saveCard}
                    onChange={(e) => setSaveCard(e.target.checked)}
                  />
                  <label htmlFor="saveCard" className="checkbox-label">
                    Save this card for future payments
                  </label>
                </div>
              </div>
            )}
            
            <div className="security-notice">
              <i className="la la-lock security-icon"></i>
              <span className="security-text">
                Your payment information is encrypted and secure. We never store your CVV.
              </span>
            </div>
          </div>
          
          <div className="modal-footer">
            <button className="btn btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button 
              className="btn btn-pay" 
              onClick={handlePayment}
              disabled={processing}
            >
              {processing ? (
                <>
                  <div className="spinner"></div>
                  Processing...
                </>
              ) : (
                <>
                  <i className="la la-credit-card"></i>
                  Pay £{amount}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentModal;