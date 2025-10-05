"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const CurrentSubscription = () => {
  const router = useRouter();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPlans, setShowPlans] = useState(false);

  useEffect(() => {
    // Fetch current subscription from backend
    fetchCurrentSubscription();
  }, []);

  const fetchCurrentSubscription = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await getSubscription();
      // setSubscription(response.data);
      
      // Mock data for now
      setTimeout(() => {
        setSubscription({
          plan: "Free",
          status: "active",
          price: 0,
          currency: "GBP",
          billing_cycle: "monthly",
          features: {
            job_applications: { used: 3, limit: 5 },
            profile_visibility: "basic",
            priority_support: false,
            skill_badges: false
          }
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching subscription:", error);
      toast.error("Failed to load subscription details");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="ls-widget">
        <div className="widget-content" style={{ padding: '50px', textAlign: 'center' }}>
          <i className="la la-spinner la-spin" style={{ fontSize: '40px', color: '#1967d2' }}></i>
          <p>Loading subscription details...</p>
        </div>
      </div>
    );
  }

  const usagePercentage = subscription ? (subscription.features.job_applications.used / subscription.features.job_applications.limit) * 100 : 0;

  return (
    <div className="ls-widget">
      <div className="widget-title">
        <h4>Current Subscription</h4>
      </div>
      <div className="widget-content">
        {subscription ? (
          <div className="current-subscription-box">
            <div className="row">
              <div className="col-lg-8">
                <div className="subscription-header" style={{
                  background: 'linear-gradient(135deg, #1967d2 0%, #4a90e2 100%)',
                  borderRadius: '12px',
                  padding: '30px',
                  color: 'white',
                  marginBottom: '30px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <h3 style={{ 
                        color: 'white', 
                        marginBottom: '10px',
                        fontSize: '28px',
                        fontWeight: '600'
                      }}>
                        {subscription.plan} Plan
                        <span style={{
                          marginLeft: '10px',
                          padding: '5px 14px',
                          background: 'rgba(255,255,255,0.25)',
                          borderRadius: '20px',
                          fontSize: '12px',
                          textTransform: 'uppercase',
                          fontWeight: '500'
                        }}>
                          {subscription.status}
                        </span>
                      </h3>
                      <p style={{ 
                        opacity: 1, 
                        fontSize: '15px',
                        color: 'rgba(255,255,255,0.95)'
                      }}>
                        No credit card required
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ 
                        fontSize: '14px', 
                        color: 'rgba(255,255,255,0.9)',
                        marginBottom: '5px',
                        fontWeight: '500'
                      }}>
                        Plan Type
                      </p>
                      <p style={{ 
                        fontSize: '20px', 
                        fontWeight: '600',
                        color: 'white',
                        marginBottom: '8px'
                      }}>
                        Starter
                      </p>
                      <p style={{ 
                        fontSize: '13px', 
                        color: 'rgba(255,255,255,0.95)',
                        marginTop: '5px'
                      }}>
                        Upgrade for more features
                      </p>
                    </div>
                  </div>
                </div>

                {/* Usage Stats */}
                <div className="usage-stats" style={{ marginBottom: '30px' }}>
                  <h5 style={{ 
                    marginBottom: '20px', 
                    fontSize: '16px', 
                    fontWeight: '600',
                    color: '#202124'
                  }}>
                    Usage This Month
                  </h5>
                  
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: '#555', fontSize: '14px' }}>Job Applications</span>
                      <span style={{ fontWeight: '600', color: '#202124' }}>
                        {subscription.features.job_applications.used} / {subscription.features.job_applications.limit}
                      </span>
                    </div>
                    <div style={{
                      height: '8px',
                      background: '#e8e8e8',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${usagePercentage}%`,
                        height: '100%',
                        background: usagePercentage > 80 ? '#ff4d4f' : '#1967d2',
                        borderRadius: '4px',
                        transition: 'width 0.3s'
                      }}></div>
                    </div>
                    {usagePercentage > 80 && (
                      <p style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '5px' }}>
                        ⚠️ You're approaching your monthly limit. Upgrade for unlimited applications!
                      </p>
                    )}
                  </div>

                  <div className="features-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '15px',
                    marginTop: '20px'
                  }}>
                    <div style={{ 
                      padding: '15px',
                      background: '#f8fafb',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      border: '1px solid #e8e8e8'
                    }}>
                      <i className="la la-eye" 
                         style={{ fontSize: '20px', color: '#1967d2' }}></i>
                      <div>
                        <p style={{ fontSize: '12px', color: '#696969', margin: 0 }}>Profile Visibility</p>
                        <p style={{ fontSize: '14px', fontWeight: '600', margin: 0, color: '#202124' }}>
                          Basic
                        </p>
                      </div>
                    </div>

                    <div style={{ 
                      padding: '15px',
                      background: '#f8fafb',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      border: '1px solid #e8e8e8'
                    }}>
                      <i className="la la-headset" 
                         style={{ fontSize: '20px', color: '#ccc' }}></i>
                      <div>
                        <p style={{ fontSize: '12px', color: '#696969', margin: 0 }}>Priority Support</p>
                        <p style={{ fontSize: '14px', fontWeight: '600', margin: 0, color: '#696969' }}>
                          Not Available
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="subscription-actions" style={{
                  padding: '20px',
                  background: '#f8fafb',
                  borderRadius: '8px',
                  border: '1px solid #e8e8e8'
                }}>
                  <h6 style={{ 
                    marginBottom: '20px', 
                    fontSize: '14px', 
                    fontWeight: '600',
                    color: '#202124'
                  }}>
                    Quick Actions
                  </h6>
                  
                  <button 
                    className="theme-btn btn-style-one w-100 mb-3"
                    onClick={() => setShowPlans(true)}
                  >
                    <i className="la la-rocket"></i> Upgrade Account
                  </button>

                  <div style={{ 
                    marginTop: '20px', 
                    padding: '15px', 
                    background: 'white', 
                    borderRadius: '6px',
                    border: '1px solid #e8e8e8'
                  }}>
                    <p style={{ fontSize: '12px', color: '#696969', margin: 0 }}>
                      Need help? <a href="/contact" style={{ color: '#1967d2' }}>Contact Support</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <i className="la la-credit-card" style={{ fontSize: '60px', color: '#1967d2', marginBottom: '20px' }}></i>
            <h3>No Active Subscription</h3>
            <p style={{ color: '#696969', marginBottom: '30px' }}>
              Choose a plan to unlock premium features and boost your job search
            </p>
            <button 
              className="theme-btn btn-style-one"
              onClick={() => setShowPlans(true)}
            >
              View Available Plans
            </button>
          </div>
        )}

        {/* Show plans modal/section when upgrade is clicked */}
        {showPlans && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '40px',
              maxWidth: '500px',
              width: '90%'
            }}>
              <h3 style={{ marginBottom: '20px' }}>Upgrade Coming Soon!</h3>
              <p style={{ color: '#696969', marginBottom: '30px' }}>
                Premium plans will be available soon. Stay tuned for unlimited job applications, 
                priority support, and enhanced profile visibility.
              </p>
              <button 
                className="theme-btn btn-style-one w-100"
                onClick={() => setShowPlans(false)}
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentSubscription;