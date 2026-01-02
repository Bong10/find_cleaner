// components/onboarding/steps/WelcomeComplete.jsx
"use client";
import Image from 'next/image';

const WelcomeComplete = ({ formData, userRole }) => {
  const isCleaner = userRole === 'cleaner' || userRole === 'candidate';
  
  const nextSteps = isCleaner ? [
    { icon: '📸', title: 'Add Portfolio Photos', description: 'Showcase your best work to attract clients' },
    { icon: '🔍', title: 'Browse Jobs', description: 'Find cleaning opportunities in your area' },
    { icon: '💬', title: 'Respond Quickly', description: 'Fast responses get more bookings' },
    { icon: '⭐', title: 'Build Reviews', description: 'Great service leads to 5-star ratings' }
  ] : [
    { icon: '📝', title: 'Post Your First Job', description: 'Create a detailed job listing' },
    { icon: '🔍', title: 'Browse Cleaners', description: 'Find verified professionals nearby' },
    { icon: '💬', title: 'Message Cleaners', description: 'Discuss your needs directly' },
    { icon: '📅', title: 'Schedule Service', description: 'Book your preferred cleaner' }
  ];

  const tips = isCleaner ? [
    'Complete profiles get 3x more job requests',
    'Respond to messages within 1 hour for best results',
    'Keep your availability calendar updated',
    'Upload before/after photos to build trust'
  ] : [
    'Detailed job posts attract better cleaners',
    'Check cleaner reviews and verification badges',
    'Communicate expectations clearly',
    'Leave reviews after each service'
  ];

  return (
    <div className="welcome-container">
      <div className="confetti-wrapper">
        <div className="confetti">🎉</div>
        <div className="confetti delay-1">✨</div>
        <div className="confetti delay-2">🎊</div>
        <div className="confetti delay-3">⭐</div>
      </div>

      <div className="welcome-header">
        <div className="success-badge">
          <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
            <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
          </svg>
        </div>
        
        <h1>Welcome to Find Cleaner, {formData.name || 'Friend'}!</h1>
        <p className="welcome-subtitle">
          Your profile is all set up. Click below to save your profile and go to your dashboard.
        </p>
      </div>

      <div className="stats-preview">
        <div className="stat-item">
          <span className="stat-number">{isCleaner ? '500+' : '1000+'}</span>
          <span className="stat-label">{isCleaner ? 'Jobs Available' : 'Verified Cleaners'}</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">4.8⭐</span>
          <span className="stat-label">Average Rating</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">24/7</span>
          <span className="stat-label">Support Available</span>
        </div>
      </div>

      <div className="next-steps">
        <h2>What's Next?</h2>
        <div className="steps-grid">
          {nextSteps.map((step, index) => (
            <div key={index} className="step-card">
              <div className="step-number">{index + 1}</div>
              <span className="step-icon">{step.icon}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="pro-tips">
        <div className="tips-header">
          <span className="tips-icon">💡</span>
          <h3>Pro Tips for Success</h3>
        </div>
        <ul className="tips-list">
          {tips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </div>

      <style jsx>{`
        .welcome-container {
          background: white;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          position: relative;
          overflow: hidden;
        }

        .confetti-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 200px;
          pointer-events: none;
        }

        .confetti {
          position: absolute;
          font-size: 24px;
          animation: fall 3s ease-in-out infinite;
        }

        .confetti:nth-child(1) { left: 10%; }
        .confetti:nth-child(2) { left: 30%; }
        .confetti:nth-child(3) { left: 60%; }
        .confetti:nth-child(4) { left: 85%; }

        .delay-1 { animation-delay: 0.5s; }
        .delay-2 { animation-delay: 1s; }
        .delay-3 { animation-delay: 1.5s; }

        @keyframes fall {
          0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(200px) rotate(360deg);
            opacity: 0;
          }
        }

        .welcome-header {
          text-align: center;
          margin-bottom: 40px;
          position: relative;
          z-index: 1;
        }

        .success-badge {
          width: 80px;
          height: 80px;
          margin: 0 auto 24px;
        }

        .checkmark {
          width: 100%;
          height: 100%;
        }

        .checkmark__circle {
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          stroke-width: 2;
          stroke-miterlimit: 10;
          stroke: #4b9b97;
          fill: #f0f9f7;
          animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }

        .checkmark__check {
          transform-origin: 50% 50%;
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          stroke: #4b9b97;
          stroke-width: 3;
          animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
        }

        @keyframes stroke {
          100% {
            stroke-dashoffset: 0;
          }
        }

        h1 {
          font-size: 32px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 8px;
        }

        .welcome-subtitle {
          font-size: 18px;
          color: #6b7280;
        }

        .stats-preview {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 20px;
          padding: 24px;
          background: linear-gradient(135deg, #f0f9f7 0%, #e8f5f3 100%);
          border-radius: 12px;
          margin-bottom: 40px;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 28px;
          font-weight: 700;
          color: #4b9b97;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 13px;
          color: #6b7280;
        }

        .next-steps {
          margin-bottom: 40px;
        }

        .next-steps h2 {
          font-size: 24px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 20px;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .step-card {
          position: relative;
          padding: 24px;
          background: #f9fafb;
          border-radius: 12px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .step-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .step-number {
          position: absolute;
          top: 12px;
          left: 12px;
          width: 24px;
          height: 24px;
          background: #4b9b97;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
        }

        .step-icon {
          display: block;
          font-size: 32px;
          margin-bottom: 12px;
        }

        .step-card h3 {
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 8px;
        }

        .step-card p {
          font-size: 13px;
          color: #6b7280;
          line-height: 1.4;
        }

        .pro-tips {
          padding: 24px;
          background: #fffbf0;
          border: 1px solid #fbbf24;
          border-radius: 12px;
        }

        .tips-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .tips-icon {
          font-size: 24px;
        }

        .tips-header h3 {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .tips-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .tips-list li {
          position: relative;
          padding-left: 24px;
          margin-bottom: 8px;
          font-size: 14px;
          color: #374151;
        }

        .tips-list li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #4b9b97;
          font-weight: 600;
        }

        @media (max-width: 640px) {
          .welcome-container {
            padding: 24px;
          }

          h1 {
            font-size: 24px;
          }

          .steps-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default WelcomeComplete;