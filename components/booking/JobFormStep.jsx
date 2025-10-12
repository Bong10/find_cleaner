"use client";

import { updateJobField, setJobServices } from "@/store/slices/jobsSlice";
import { toast } from "react-toastify";

const JobFormStep = ({ jobForm, services, dispatch, onNext, onBack }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!jobForm?.title?.trim()) {
      toast.error("Please enter job title");
      return;
    }
    if (!jobForm?.description?.trim()) {
      toast.error("Please enter job description");
      return;
    }
    if (!jobForm?.location?.trim()) {
      toast.error("Please enter job location");
      return;
    }
    if (!jobForm?.date) {
      toast.error("Please select date");
      return;
    }
    if (!jobForm?.time) {
      toast.error("Please select time");
      return;
    }
    if (!jobForm?.services || jobForm.services.length === 0) {
      toast.error("Please select at least one service");
      return;
    }
    
    onNext();
  };
  
  // Default services if none loaded
  const defaultServices = [
    { id: 1, name: "House Cleaning" },
    { id: 2, name: "Office Cleaning" },
    { id: 3, name: "Deep Cleaning" },
    { id: 4, name: "Window Cleaning" },
    { id: 5, name: "Carpet Cleaning" },
    { id: 6, name: "End of Tenancy Cleaning" }
  ];
  
  const servicesList = services.length > 0 ? services : defaultServices;
  
  return (
    <>
      <style jsx>{`
        .form-container {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .form-header {
          text-align: center;
          margin-bottom: 40px;
        }
        
        .form-title {
          font-size: 32px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 15px;
        }
        
        .form-subtitle {
          font-size: 16px;
          color: #6b7280;
        }
        
        .form-card {
          background: white;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
        }
        
        .form-group {
          margin-bottom: 25px;
        }
        
        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }
        
        .required {
          color: #ef4444;
        }
        
        .form-input,
        .form-textarea,
        .form-select {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 15px;
          transition: all 0.3s ease;
          background: white;
        }
        
        .form-input:focus,
        .form-textarea:focus,
        .form-select:focus {
          outline: none;
          border-color: #4C9A99;
          box-shadow: 0 0 0 3px rgba(76, 154, 153, 0.1);
        }
        
        .form-textarea {
          resize: vertical;
          min-height: 120px;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }
        
        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-top: 10px;
        }
        
        .service-checkbox {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          background: #f9fafb;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .service-checkbox:hover {
          background: rgba(76, 154, 153, 0.05);
          border-color: #4C9A99;
        }
        
        .service-checkbox.selected {
          background: linear-gradient(135deg, rgba(76, 154, 153, 0.1) 0%, rgba(45, 95, 95, 0.1) 100%);
          border-color: #4C9A99;
        }
        
        .service-checkbox input {
          margin-right: 10px;
          width: 18px;
          height: 18px;
          cursor: pointer;
        }
        
        .service-checkbox label {
          cursor: pointer;
          font-size: 14px;
          color: #374151;
          user-select: none;
        }
        
        .form-actions {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin-top: 40px;
        }
        
        .btn {
          padding: 15px 35px;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        
        .btn-secondary {
          background: #f3f4f6;
          color: #4b5563;
        }
        
        .btn-secondary:hover {
          background: #e5e7eb;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #4C9A99 0%, #2d5f5f 100%);
          color: white;
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(76, 154, 153, 0.3);
        }
        
        .info-box {
          background: linear-gradient(135deg, rgba(76, 154, 153, 0.05) 0%, rgba(45, 95, 95, 0.05) 100%);
          border-left: 4px solid #4C9A99;
          padding: 15px 20px;
          border-radius: 10px;
          margin-bottom: 25px;
        }
        
        .info-box p {
          margin: 0;
          color: #374151;
          font-size: 14px;
        }
      `}</style>
      
      <div className="form-container">
        <div className="form-header">
          <h2 className="form-title">Create New Job</h2>
          <p className="form-subtitle">Fill in the details for your cleaning job</p>
        </div>
        
        <div className="form-card">
          <div className="info-box">
            <p>
              <strong>Quick Tip:</strong> Be specific about your requirements to ensure the cleaner understands exactly what you need.
            </p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                Job Title <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Weekly House Cleaning, Office Deep Clean"
                value={jobForm?.title || ""}
                onChange={(e) => dispatch(updateJobField({ 
                  name: 'title', 
                  value: e.target.value 
                }))}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">
                Description <span className="required">*</span>
              </label>
              <textarea
                className="form-textarea"
                placeholder="Describe the cleaning tasks, any special requirements, and what areas need attention..."
                value={jobForm?.description || ""}
                onChange={(e) => dispatch(updateJobField({ 
                  name: 'description', 
                  value: e.target.value 
                }))}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">
                Location <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Full address or area"
                value={jobForm?.location || ""}
                onChange={(e) => dispatch(updateJobField({ 
                  name: 'location', 
                  value: e.target.value 
                }))}
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Date <span className="required">*</span>
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={jobForm?.date || ""}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => dispatch(updateJobField({ 
                    name: 'date', 
                    value: e.target.value 
                  }))}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  Time <span className="required">*</span>
                </label>
                <input
                  type="time"
                  className="form-input"
                  value={jobForm?.time || ""}
                  onChange={(e) => dispatch(updateJobField({ 
                    name: 'time', 
                    value: e.target.value 
                  }))}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Hourly Rate (£)
                </label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="20"
                  value={jobForm?.hourly_rate || ""}
                  min="0"
                  step="0.01"
                  onChange={(e) => dispatch(updateJobField({ 
                    name: 'hourly_rate', 
                    value: e.target.value 
                  }))}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  Estimated Hours
                </label>
                <input
                  type="number"
                  className="form-input"
                  value={jobForm?.hours_required || 1}
                  min="1"
                  onChange={(e) => dispatch(updateJobField({ 
                    name: 'hours_required', 
                    value: e.target.value 
                  }))}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">
                Services Required <span className="required">*</span>
              </label>
              <div className="services-grid">
                {servicesList.map(service => (
                  <div 
                    key={service.id}
                    className={`service-checkbox ${
                      jobForm?.services?.includes(service.id) ? 'selected' : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      id={`service-${service.id}`}
                      checked={jobForm?.services?.includes(service.id) || false}
                      onChange={(e) => {
                        const currentServices = jobForm?.services || [];
                        const newServices = e.target.checked
                          ? [...currentServices, service.id]
                          : currentServices.filter(id => id !== service.id);
                        dispatch(setJobServices(newServices));
                      }}
                    />
                    <label htmlFor={`service-${service.id}`}>
                      {service.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={onBack}>
                <i className="la la-arrow-left"></i>
                Back
              </button>
              <button type="submit" className="btn btn-primary">
                Continue
                <i className="la la-arrow-right"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default JobFormStep;