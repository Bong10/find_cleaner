"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const SubscriptionPlans = () => {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      description: 'Perfect for getting started',
      color: '#6c757d',
      current: true,
      features: [
        { text: '5 job applications per month', included: true },
        { text: 'Basic profile', included: true },
        { text: 'Job alerts', included: true },
        { text: 'Priority support', included: false },
        { text: 'Skill verification badges', included: false },
        { text: 'Featured profile', included: false },
        { text: 'Direct employer messaging', included: false },
        { text: 'Application insights', included: false }
      ]
    },
    {
      id: 'basic',
      name: 'Basic',
      price: { monthly: 9.99, yearly: 99.99 },
      description: 'Great for active job seekers',
      color: '#1967d2',
      popular: true,
      features: [
        { text: '20 job applications per month', included: true },
        { text: 'Enhanced profile', included: true },
        { text: 'Priority job alerts', included: true },
        { text: 'Basic support', included: true },
        { text: 'Skill verification badges', included: true },
        { text: 'Featured profile', included: false },
        { text: 'Direct employer messaging', included: false },
        { text: 'Application insights', included: false }
      ]
    },
    {
      id: 'professional',
      name: 'Professional',
      price: { monthly: 19.99, yearly: 199.99 },
      description: 'For serious professionals',
      color: '#764ba2',
      features: [
        { text: 'Unlimited job applications', included: true },
        { text: 'Premium profile with badge', included: true },
        { text: 'Instant job alerts', included: true },
        { text: 'Priority support 24/7', included: true },
        { text: 'All skill badges', included: true },
        { text: 'Featured profile listing', included: true },
        { text: 'Direct employer messaging', included: true },
        { text: 'Detailed application insights', included: true }
      ]
    }
  ];

  const calculateSavings = (plan) => {
    if (billingCycle === 'yearly' && plan.price.monthly > 0) {
      const yearlySavings = (plan.price.monthly * 12) - plan.price.yearly;
      return yearlySavings > 0 ? yearlySavings.toFixed(2) : 0;
    }
    return 0;
  };

  return (
    <div className="ls-widget" id="plans-section">
      <div className="widget-title">
        <h4>Available Plans</h4>
        
        {/* Billing Cycle Toggle */}
        <div style={{
          display: 'inline-flex',
          background: '#f0f0f0',
          borderRadius: '30px',
          padding: '4px'
        }}>
          <button
            onClick={() => setBillingCycle('monthly')}
            style={{
              padding: '8px 20px',
              background: billingCycle === 'monthly' ? 'white' : 'transparent',
              border: 'none',
              borderRadius: '25px',
              fontWeight: billingCycle === 'monthly' ? '600' : '400',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            style={{
              padding: '8px 20px',
              background: billingCycle === 'yearly' ? 'white' : 'transparent',
              border: 'none',
              borderRadius: '25px',
              fontWeight: billingCycle === 'yearly' ? '600' : '400',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            Yearly
            <span style={{
              marginLeft: '5px',
              padding: '2px 6px',
              background: '#52c41a',
              color: 'white',
              borderRadius: '10px',
              fontSize: '10px'
            }}>
              SAVE 17%
            </span>
          </button>
        </div>
      </div>

      <div className="widget-content">
        <div className="row">
          {plans.map((plan) => (
            <div key={plan.id} className="col-lg-4 col-md-6 mb-4">
              <div style={{
                border: plan.current ? '2px solid #52c41a' : plan.popular ? '2px solid #1967d2' : '1px solid #e0e0e0',
                borderRadius: '12px',
                padding: '30px',
                height: '100%',
                position: 'relative',
                transition: 'transform 0.3s, box-shadow 0.3s',
                background: 'white'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                {plan.current && (
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#52c41a',
                    color: 'white',
                    padding: '4px 20px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase'
                  }}>
                    Current Plan
                  </div>
                )}
                {plan.popular && !plan.current && (
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#1967d2',
                    color: 'white',
                    padding: '4px 20px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase'
                  }}>
                    Most Popular
                  </div>
                )}

                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                  <h3 style={{ 
                    fontSize: '24px', 
                    fontWeight: '600',
                    marginBottom: '10px',
                    color: plan.color 
                  }}>
                    {plan.name}
                  </h3>
                  <p style={{ color: '#696969', fontSize: '14px', marginBottom: '20px' }}>
                    {plan.description}
                  </p>
                  
                  <div style={{ marginBottom: '10px' }}>
                    <span style={{ fontSize: '36px', fontWeight: '700' }}>
                      {plan.price.monthly === 0 ? 'Free' : `£${billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly}`}
                    </span>
                    {plan.price.monthly > 0 && (
                      <span style={{ color: '#696969', marginLeft: '5px' }}>
                        /{billingCycle === 'monthly' ? 'month' : 'year'}
                      </span>
                    )}
                  </div>
                  
                  {calculateSavings(plan) > 0 && (
                    <p style={{ 
                      color: '#52c41a', 
                      fontSize: '12px',
                      margin: '5px 0'
                    }}>
                      Save £{calculateSavings(plan)} yearly
                    </p>
                  )}
                </div>

                <ul style={{ listStyle: 'none', padding: 0, marginBottom: '30px' }}>
                  {plan.features.map((feature, idx) => (
                    <li key={idx} style={{
                      padding: '10px 0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      opacity: feature.included ? 1 : 0.5
                    }}>
                      <i className={`la ${feature.included ? 'la-check-circle' : 'la-times-circle'}`}
                         style={{ 
                           color: feature.included ? '#52c41a' : '#ccc',
                           fontSize: '18px'
                         }}></i>
                      <span style={{ 
                        fontSize: '14px',
                        textDecoration: feature.included ? 'none' : 'line-through'
                      }}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {plan.current ? (
                  <button
                    className="theme-btn btn-style-two w-100"
                    disabled
                    style={{ opacity: 0.7 }}
                  >
                    Current Plan
                  </button>
                ) : (
                  <button
                    className={`theme-btn ${plan.popular ? 'btn-style-one' : 'btn-style-two'} w-100`}
                    onClick={() => toast.info("Premium plans coming soon!")}
                  >
                    Coming Soon
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;