"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const BillingHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasPaymentMethod, setHasPaymentMethod] = useState(false);

  useEffect(() => {
    fetchBillingHistory();
    checkPaymentMethod();
  }, []);

  const fetchBillingHistory = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await getBillingHistory();
      // setTransactions(response.data);
      
      // Mock data - empty for free user
      setTimeout(() => {
        setTransactions([]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching billing history:", error);
      toast.error("Failed to load billing history");
      setLoading(false);
    }
  };

  const checkPaymentMethod = async () => {
    try {
      // TODO: Check if user has payment method
      // const response = await getPaymentMethods();
      // setHasPaymentMethod(response.data.length > 0);
      
      setHasPaymentMethod(false); // No payment method for free user
    } catch (error) {
      console.error("Error checking payment method:", error);
    }
  };

  const handleAddPaymentMethod = () => {
    toast.info("Payment methods will be available when upgrading to a premium plan");
  };

  return (
    <>
      {/* Billing History */}
      {transactions.length > 0 && (
        <div className="ls-widget">
          <div className="widget-title">
            <h4>Billing History</h4>
          </div>

          <div className="widget-content">
            <div className="table-outer">
              <table className="default-table manage-job-table">
                <thead>
                  <tr>
                    <th>Invoice ID</th>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>
                        <span style={{ fontWeight: '600' }}>{transaction.id}</span>
                      </td>
                      <td>
                        <span style={{ color: '#696969' }}>
                          {new Date(transaction.date).toLocaleDateString('en-GB')}
                        </span>
                      </td>
                      <td>
                        <div>
                          <p style={{ margin: 0 }}>{transaction.description}</p>
                          <span style={{
                            fontSize: '12px',
                            padding: '2px 8px',
                            background: transaction.type === 'subscription' ? '#e3f2fd' : '#fff3e0',
                            color: transaction.type === 'subscription' ? '#1967d2' : '#ff9800',
                            borderRadius: '10px',
                            display: 'inline-block',
                            marginTop: '5px'
                          }}>
                            {transaction.type === 'subscription' ? 'Recurring' : 'One-time'}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span style={{ 
                          fontWeight: '600',
                          color: '#2e7d32'
                        }}>
                          £{transaction.amount.toFixed(2)}
                        </span>
                      </td>
                      <td>
                        <span style={{
                          padding: '5px 12px',
                          background: transaction.status === 'paid' ? '#e8f5e9' : '#ffebee',
                          color: transaction.status === 'paid' ? '#2e7d32' : '#c62828',
                          borderRadius: '15px',
                          fontSize: '13px',
                          fontWeight: '500',
                          textTransform: 'capitalize'
                        }}>
                          {transaction.status}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => toast.info(`Downloading invoice ${transaction.id}...`)}
                          className="theme-btn btn-style-three"
                          style={{
                            padding: '5px 15px',
                            fontSize: '13px',
                            background: 'transparent',
                            color: '#1967d2',
                            border: '1px solid #1967d2'
                          }}
                        >
                          <i className="la la-download"></i> Invoice
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Payment Methods */}
      <div className="ls-widget">
        <div className="widget-title">
          <h4>Payment Methods</h4>
        </div>
        
        <div className="widget-content">
          {loading ? (
            <div style={{ padding: '50px', textAlign: 'center' }}>
              <i className="la la-spinner la-spin" style={{ fontSize: '40px', color: '#1967d2' }}></i>
              <p>Loading payment methods...</p>
            </div>
          ) : !hasPaymentMethod ? (
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <i className="la la-credit-card" style={{ fontSize: '60px', color: '#ccc', marginBottom: '20px' }}></i>
              <h4>No Payment Method</h4>
              <p style={{ color: '#696969', marginBottom: '20px' }}>
                Add a payment method to upgrade to premium plans
              </p>
              <button 
                onClick={handleAddPaymentMethod}
                className="theme-btn btn-style-one"
              >
                <i className="la la-plus"></i> Add Payment Method
              </button>
            </div>
          ) : (
            <div style={{
              padding: '30px',
              background: '#f8f9fa',
              borderRadius: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{
                    width: '50px',
                    height: '32px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <i className="la la-credit-card" style={{ color: 'white', fontSize: '20px' }}></i>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: '600' }}>•••• •••• •••• 4242</p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#696969' }}>Expires 12/25</p>
                  </div>
                </div>
                <button className="theme-btn btn-style-three" style={{
                  padding: '8px 20px',
                  fontSize: '13px',
                  background: 'white',
                  color: '#1967d2',
                  border: '1px solid #1967d2'
                }}>
                  Update Card
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BillingHistory;