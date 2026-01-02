"use client";

const BookingProgress = ({ currentStep }) => {
  const steps = [
    { number: 1, title: "Select Option", icon: "la-clipboard-list" },
    { number: 2, title: "Job Details", icon: "la-edit" },
    { number: 3, title: "Confirm Booking", icon: "la-check-circle" }
  ];
  
  return (
    <>
      <style jsx>{`
        .progress-container {
          max-width: 800px;
          margin: 0 auto 50px;
          background: white;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
        }
        
        .progress-wrapper {
          display: flex;
          justify-content: space-between;
          position: relative;
        }
        
        .progress-line {
          position: absolute;
          top: 30px;
          left: 0;
          right: 0;
          height: 2px;
          background: #e5e7eb;
          z-index: 0;
        }
        
        .progress-line-active {
          position: absolute;
          top: 30px;
          left: 0;
          height: 2px;
          background: linear-gradient(90deg, #4C9A99 0%, #2d5f5f 100%);
          transition: width 0.5s ease;
          z-index: 1;
        }
        
        .progress-step {
          position: relative;
          z-index: 2;
          text-align: center;
          flex: 1;
        }
        
        .step-circle {
          width: 60px;
          height: 60px;
          margin: 0 auto 15px;
          border-radius: 50%;
          background: white;
          border: 3px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        
        .step-circle.active {
          border-color: #4C9A99;
          background: linear-gradient(135deg, #4C9A99 0%, #2d5f5f 100%);
          transform: scale(1.1);
        }
        
        .step-circle.completed {
          border-color: #4C9A99;
          background: #4C9A99;
        }
        
        .step-icon {
          font-size: 24px;
          color: #9ca3af;
          transition: color 0.3s ease;
        }
        
        .step-circle.active .step-icon,
        .step-circle.completed .step-icon {
          color: white;
        }
        
        .step-title {
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
          transition: color 0.3s ease;
        }
        
        .progress-step.active .step-title {
          color: #4C9A99;
        }
        
        .progress-step.completed .step-title {
          color: #1f2937;
        }
        
        @media (max-width: 768px) {
          .progress-container {
            padding: 20px;
          }
          
          .step-circle {
            width: 50px;
            height: 50px;
          }
          
          .step-icon {
            font-size: 20px;
          }
          
          .step-title {
            font-size: 12px;
          }
        }
      `}</style>
      
      <div className="progress-container">
        <div className="progress-wrapper">
          <div className="progress-line"></div>
          <div 
            className="progress-line-active" 
            style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
          ></div>
          
          {steps.map((step) => (
            <div 
              key={step.number}
              className={`progress-step ${
                currentStep === step.number ? 'active' : ''
              } ${currentStep > step.number ? 'completed' : ''}`}
            >
              <div className={`step-circle ${
                currentStep === step.number ? 'active' : ''
              } ${currentStep > step.number ? 'completed' : ''}`}>
                <i className={`la ${step.icon} step-icon`}></i>
              </div>
              <div className="step-title">{step.title}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BookingProgress;