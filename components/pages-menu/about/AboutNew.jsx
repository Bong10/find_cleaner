"use client";

import Link from "next/link";
import Image from "next/image";

const AboutNew = () => {
  return (
    <>
      {/* Hero Section */}
      <header className="hero">
        <div className="hero-background-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
        <div className="auto-container hero-inner">
          <div className="hero-text">
            <div className="hero-badge">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              <span>UK Community Interest Company</span>
            </div>
            <h1>
              More than cleaning.<br />
              <span className="gradient-text">A platform built on</span><br />
              <span className="highlight-text">fairness and care.</span>
            </h1>
            <p>Find-Cleaner connects households with trusted cleaners, while reinvesting profits to support vulnerable people with subsidized cleaning services.</p>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <div className="stat-content">
                  <strong>Trusted Cleaners</strong>
                  <span>Vetted Professionals</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
                    <line x1="16" y1="8" x2="2" y2="22"></line>
                    <line x1="17.5" y1="15" x2="9" y2="15"></line>
                  </svg>
                </div>
                <div className="stat-content">
                  <strong>Fair Pay</strong>
                  <span>Ethical Standards</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 6v6l4 2"></path>
                  </svg>
                </div>
                <div className="stat-content">
                  <strong>Social Impact</strong>
                  <span>Community Support</span>
                </div>
              </div>
            </div>
          </div>
          <div className="hero-img-wrapper">
            <div className="floating-badge badge-1">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span>Verified</span>
            </div>
            <div className="floating-badge badge-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
              </svg>
              <span>5★ Service</span>
            </div>
            <div className="hero-img-card">
              <Image 
                src="/images/resource/banner-img-1.png" 
                alt="Professional Cleaner" 
                width={600} 
                height={400}
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="auto-container main-section">
        <div className="main-grid">
          
          {/* Left Column */}
          <div className="left-col">
            <section>
              <h2>Who we are</h2>
              <div className="team-photo-wrapper">
                <Image 
                  src="/images/resource/about-img-1.jpg" 
                  className="team-photo" 
                  alt="Cleaning Team"
                  width={800}
                  height={400}
                />
              </div>
              
              <h3>Find-Cleaner</h3>
              <p>We're creating to solve two problems at once: unreliable access to cleaning for households, and unfair pay and conditions for cleaners. We operate a transparent marketplace where quality service, fair pay and social impact come first.</p>
            </section>

            <section className="cic-box">
              <h3>How our CIC model works</h3>
              <div className="cic-icons">
                <div className="cic-step">
                  <div className="icon-circle">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                  </div>
                  <span>Households book vetted cleaners</span>
                </div>
                <div className="arrow">→</div>
                <div className="cic-step">
                  <div className="icon-circle">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                  </div>
                  <span>Cleaners are paid fairly</span>
                </div>
                <div className="arrow">→</div>
                <div className="cic-step">
                  <div className="icon-circle">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <span>A portion of revenue funds subsidized cleaning</span>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="right-col">
            <section>
              <h2>Why we exist</h2>
              <p>Many elderly, disabled, and financially vulnerable people struggle to keep their homes safe and clean. At the same time, many cleaners face underpayment and unstable work.</p>
              <p style={{ fontWeight: 500, color: '#1C2E3D' }}>Find-Cleaner exists to change both, without charity, without stigma.</p>
            </section>

            <section className="values-section">
              <h2>Our values</h2>
              <div className="values-grid">
                <div className="value-card">
                  <div className="value-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
                      <line x1="16" y1="8" x2="2" y2="22"></line>
                      <line x1="17.5" y1="15" x2="9" y2="15"></line>
                    </svg>
                  </div>
                  <h4>Fair Work</h4>
                  <p>Cleaners are paid fairly and treated with respect.</p>
                </div>
                <div className="value-card">
                  <div className="value-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                  </div>
                  <h4>Dignity</h4>
                  <p>Support is discreet and stigma-free.</p>
                </div>
                <div className="value-card">
                  <div className="value-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <h4>Community Impact</h4>
                  <p>Profits are reinvested, not extracted.</p>
                </div>
                <div className="value-card">
                  <div className="value-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                  </div>
                  <h4>Transparency</h4>
                  <p>Open pricing with background-checked cleaners.</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Transparency Section */}
      <section className="transparency-section">
        <div className="auto-container">
          <div className="t-header">
            <h2>Transparency Matters</h2>
          </div>
          
          <div className="t-grid">
            <div className="t-card">
              <div className="t-icon-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  <path d="M9 12l2 2 4-4"></path>
                </svg>
              </div>
              <h4>Background-Checked<br/>Cleaners</h4>
              <p>All professionals are thoroughly vetted for your safety and peace of mind.</p>
            </div>

            <div className="t-card">
              <div className="t-icon-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <h4>Secure<br/>Payments</h4>
              <p>Your transactions are protected with bank-level security protocols.</p>
            </div>

            <div className="t-card">
              <div className="t-icon-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                  <line x1="7" y1="7" x2="7.01" y2="7"></line>
                </svg>
              </div>
              <h4>Clear<br/>Pricing</h4>
              <p>No hidden fees. You always know exactly what you pay and where it goes.</p>
            </div>

            <div className="t-card">
              <div className="t-icon-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
              </div>
              <h4>UK-registered CIC<br/>Company</h4>
              <p>Officially registered for social good, reinvesting profits into the community.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Section */}
      <section className="bottom-section">
        <div className="auto-container">
          <h2>Built locally, designed to scale</h2>
          <p style={{ maxWidth: '650px', margin: '0 auto 50px auto' }}>We're starting locally and building carefully, ensuring quality and impact, before expanding to more UK communities.</p>

          <div className="bottom-cards">
            <div className="cta-card">
              <div className="cta-top">
                <div className="avatar-wrapper">
                  <Image src="/images/resource/candidate-1.png" width={60} height={60} className="avatar" alt="Woman" />
                </div>
                <h4>Find a Cleaner</h4>
              </div>
              <Link href="/candidates-list-v2" className="theme-btn btn-style-one">Find a Cleaner</Link>
            </div>

            <div className="cta-card">
              <div className="cta-top">
                <div className="avatar-wrapper">
                  <Image src="/images/resource/candidate-2.png" width={60} height={60} className="avatar" alt="Couple" />
                </div>
                <h4>Check Eligibility for<br/>Supported Cleaning</h4>
              </div>
              <Link href="/check-eligibility" className="theme-btn btn-style-one">Check Eligibility</Link>
            </div>

            <div className="cta-card">
              <div className="cta-top">
                <div className="avatar-wrapper">
                  <Image src="/images/resource/candidate-3.png" width={60} height={60} className="avatar" alt="Man" />
                </div>
                <h4>Become a Cleaner</h4>
              </div>
              <Link href="/register" className="theme-btn btn-style-one">Become a Cleaner</Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        /* Variables */
        :global(:root) {
          --teal-btn: #2E8B8B;
          --teal-hover: #247272;
          --blue-accent: #3182CE;
          --text-dark: #1C2E3D;
          --text-body: #4A5568;
          --bg-light: #F4F9F9;
          --bg-white: #FFFFFF;
          --box-bg: #EDF6F6;
          --radius-sm: 6px;
          --radius-md: 12px;
          --radius-xl: 20px;
          --shadow-card: 0 4px 20px rgba(0,0,0,0.06);
          --shadow-float: 0 15px 40px rgba(46, 139, 139, 0.1);
          --shadow-hover: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        h1, h2, h3, h4 { color: #1C2E3D; }
        p { color: #4A5568; line-height: 1.6; }

        /* Buttons */
        /* Using global site styles: .theme-btn and .btn-style-one from public/scss/components/button.scss */

        /* Hero Section */
        .hero {
          background: linear-gradient(135deg, #E8F7F3 0%, #F0F9F7 50%, #FFFFFF 100%);
          padding: 100px 0;
          position: relative;
          overflow: hidden;
        }
        
        .hero-background-shapes {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          pointer-events: none;
          z-index: 0;
        }
        
        .shape {
          position: absolute;
          border-radius: 50%;
          opacity: 0.08;
        }
        
        .shape-1 {
          width: 400px;
          height: 400px;
          background: linear-gradient(135deg, #2aa389, #4B9B97);
          top: -150px;
          right: -100px;
          animation: float 20s ease-in-out infinite;
        }
        
        .shape-2 {
          width: 300px;
          height: 300px;
          background: linear-gradient(135deg, #4B9B97, #2aa389);
          bottom: -100px;
          left: -50px;
          animation: float 15s ease-in-out infinite reverse;
        }
        
        .shape-3 {
          width: 200px;
          height: 200px;
          background: linear-gradient(135deg, #2aa389, #5CBFAD);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: pulse 10s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(20px, -20px) rotate(5deg); }
          50% { transform: translate(-15px, -30px) rotate(-3deg); }
          75% { transform: translate(25px, -10px) rotate(7deg); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.08; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.12; }
        }
        
        .hero-inner { 
          display: grid; 
          grid-template-columns: 1.1fr 1fr; 
          align-items: center; 
          gap: 80px;
          position: relative;
          z-index: 1;
        }
        
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, rgba(42, 163, 137, 0.12), rgba(75, 155, 151, 0.1));
          backdrop-filter: blur(10px);
          border: 1.5px solid rgba(42, 163, 137, 0.25);
          padding: 10px 20px;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #2aa389;
          margin-bottom: 30px;
          animation: slideInLeft 0.8s ease-out;
        }
        
        .hero-badge svg {
          width: 18px;
          height: 18px;
          color: #2aa389;
        }
        
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .hero h1 { 
          font-size: 3.5rem; 
          line-height: 1.2; 
          margin-bottom: 30px; 
          letter-spacing: -1.5px; 
          color: #1C2E3D;
          animation: fadeInUp 1s ease-out 0.2s backwards;
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #2aa389 0%, #4B9B97 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 700;
        }
        
        .highlight-text {
          color: var(--primary-color);
          font-weight: 700;
          position: relative;
          display: inline-block;
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .hero p { 
          font-size: 1.2rem; 
          color: #4A5568; 
          max-width: 95%; 
          margin-bottom: 40px; 
          line-height: 1.8;
          animation: fadeInUp 1s ease-out 0.4s backwards;
        }
        
        .hero-stats {
          display: flex;
          gap: 30px;
          flex-wrap: wrap;
          animation: fadeInUp 1s ease-out 0.6s backwards;
        }
        
        .stat-item {
          display: flex;
          align-items: center;
          gap: 12px;
          background: white;
          padding: 15px 20px;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }
        
        .stat-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(42, 163, 137, 0.18);
        }
        
        .stat-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #E8F7F3, #F0F9F7);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .stat-icon svg {
          width: 22px;
          height: 22px;
          color: var(--primary-color);
        }
        
        .stat-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        
        .stat-content strong {
          font-size: 0.95rem;
          color: #1C2E3D;
          font-weight: 700;
        }
        
        .stat-content span {
          font-size: 0.8rem;
          color: #64748B;
        }

        .hero-img-wrapper {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          animation: fadeInRight 1s ease-out 0.4s backwards;
        }
        
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .floating-badge {
          position: absolute;
          background: white;
          padding: 12px 18px;
          border-radius: 50px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #1C2E3D;
          z-index: 2;
          animation: floatBadge 3s ease-in-out infinite;
        }
        
        .floating-badge svg {
          width: 18px;
          height: 18px;
          color: var(--primary-color);
        }
        
        .badge-1 {
          top: 20px;
          right: -20px;
          animation-delay: 0s;
        }
        
        .badge-2 {
          bottom: 40px;
          left: -30px;
          animation-delay: 1.5s;
        }
        
        @keyframes floatBadge {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .hero-img-card {
          background: white;
          padding: 25px;
          border-radius: 40px;
          box-shadow: 0 30px 80px rgba(42, 163, 137, 0.22);
          width: 100%;
          max-width: 550px;
          position: relative;
          z-index: 1;
          border: 3px solid rgba(255, 255, 255, 0.8);
          transition: all 0.4s ease;
        }
        
        .hero-img-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 40px 100px rgba(42, 163, 137, 0.28);
        }
        
        .hero-img-card::before {
          content: '';
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
          background: linear-gradient(135deg, var(--primary-color), #4B9B97);
          border-radius: 45px;
          z-index: -1;
          opacity: 0.12;
        }

        /* Main Content Grid */
        /* Add horizontal padding so content isn't flush to edges */
        .auto-container { padding: 0 24px; }
        .main-section { padding: 80px 24px; }
        .main-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 80px; }

        /* Left Column */
        .team-photo-wrapper {
          width: 100%;
          height: 250px;
          border-radius: 6px;
          margin: 20px 0;
          overflow: hidden;
        }
        .team-photo { width: 100%; height: 100%; object-fit: cover; }
        
        h2 { font-size: 1.8rem; margin-bottom: 16px; font-weight: 700; }
        h3 { font-size: 1.3rem; margin-bottom: 12px; font-weight: 600; }
        
        /* CIC Model Box */
        .cic-box {
          background-color: #EDF6F6;
          padding: 30px;
          border-radius: 12px;
          margin: 40px 0 0 0;
        }
        .cic-icons { display: flex; justify-content: space-between; align-items: flex-start; margin-top: 25px; text-align: center; }
        .cic-step { flex: 1; display: flex; flex-direction: column; align-items: center; font-size: 0.9rem; line-height: 1.3; padding: 0 5px; }
        
        .icon-circle {
          width: 60px;
          height: 60px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
          color: var(--primary-color);
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        }
        .icon-circle svg { width: 28px; height: 28px; }
        
        .arrow { padding-top: 20px; color: var(--primary-color); font-size: 24px; opacity: 0.6; }

        /* Right Column (Values) */
        .values-section { margin-top: 50px; }
        .values-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .value-card {
          background: white;
          padding: 24px 16px;
          border-radius: 12px;
          box-shadow: 0 2px 15px rgba(0,0,0,0.04);
          text-align: center;
          border: 1px solid #f0f0f0;
          display: flex; flex-direction: column; align-items: center;
          transition: transform 0.3s ease;
        }
        .value-card:hover { transform: translateY(-5px); border-color: var(--primary-color); }
        
        .value-icon-box {
          width: 50px;
          height: 50px;
          margin-bottom: 15px;
          color: var(--primary-color);
        }
        .value-icon-box svg { width: 100%; height: 100%; }
        
        .value-card h4 { font-size: 1rem; margin-bottom: 8px; color: #1C2E3D; font-weight: 600; }
        .value-card p { font-size: 0.85rem; color: #666; margin-bottom: 0; line-height: 1.4; }

        /* Transparency Section */
        .transparency-section {
          background: linear-gradient(135deg, #E8F7F3 0%, #F0F9F7 100%);
          padding: 100px 0;
          margin-top: 40px;
        }
        
        .t-header { text-align: center; margin-bottom: 60px; }
        .t-header h2 {
          color: var(--primary-color);
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .t-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 30px;
        }

        .t-card {
          background: white;
          padding: 40px 30px;
          border-radius: 20px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .t-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .t-icon-box {
          margin-bottom: 25px;
          width: 50px;
          height: 50px;
          color: var(--primary-color);
        }
        .t-icon-box svg { width: 100%; height: 100%; }

        .t-card h4 {
          font-size: 1.1rem;
          margin-bottom: 15px;
          color: #1C2E3D;
          line-height: 1.4;
          font-weight: 600;
        }

        .t-card p {
          font-size: 0.95rem;
          color: #64748B;
          line-height: 1.6;
          margin-bottom: 0;
        }

        /* Bottom Section */
        .bottom-section {
          background-color: #F8FAFC;
          padding: 100px 0;
          text-align: center;
        }

        .bottom-section h2 {
          margin-bottom: 20px;
          font-size: 1.8rem;
          font-weight: 700;
        }

        .bottom-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }

        .cta-card {
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          align-items: center;
        }
        
        .cta-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .cta-top {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
        }

        .avatar-wrapper {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          overflow: hidden;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          flex-shrink: 0;
        }
        
        .avatar {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .cta-top h4 {
          font-size: 1.1rem;
          line-height: 1.3;
          font-weight: 600;
          color: #1C2E3D;
          margin: 0;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .hero-inner { grid-template-columns: 1fr; gap: 60px; text-align: center; }
          .hero h1 { font-size: 3rem; }
          .t-grid { grid-template-columns: repeat(2, 1fr); }
          .bottom-cards { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 991px) {
          .hero { padding: 60px 0; }
          .auto-container { padding: 0 20px; }
          .main-section { padding: 60px 20px; }
          .hero-inner, .main-grid, .bottom-cards, .t-grid { grid-template-columns: 1fr; }
          .hero-inner { text-align: center; gap: 50px; }
          .hero-text { margin-bottom: 40px; }
          .hero h1 { font-size: 2.2rem; letter-spacing: -1px; }
          .hero p { font-size: 1.05rem; max-width: 100%; }
          .hero-badge { justify-content: center; }
          .hero-stats { justify-content: center; }
          .stat-item { flex: 1; min-width: 200px; }
          .floating-badge { display: none; }
          .t-card { margin-bottom: 20px; }
          .cta-card { margin-bottom: 20px; }
          .values-grid { grid-template-columns: 1fr; }
          .cic-icons { flex-direction: column; align-items: center; gap: 20px; }
          .arrow { transform: rotate(90deg); padding: 0; }
        }
        
        @media (max-width: 576px) {
          .auto-container { padding: 0 16px; }
          .main-section { padding: 50px 16px; }
          .hero h1 { font-size: 1.8rem; }
          .hero-stats { flex-direction: column; align-items: stretch; }
          .stat-item { min-width: auto; }
          .bottom-cards { grid-template-columns: 1fr; }
          .t-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
};

export default AboutNew;

