// components/onboarding/OnboardingFlow.jsx
"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Image from 'next/image';

// Import services and Redux actions
import { fetchCurrentUser } from '@/store/slices/authSlice';
import { patchCurrentUser, patchCurrentUserMultipart } from '@/services/cleanerService';
import { saveCompleteCleanerProfile, updateLocalStorageFields } from '@/store/slices/cleanerProfileSlice';
import { patchEmployerMe, getEmployerFields } from '@/services/employerService';

// Import all step components
import CleanerStep1 from './steps/CleanerStep1';
import CleanerStep2 from './steps/CleanerStep2';
import CleanerStep3 from './steps/CleanerStep3';
import CleanerStep4 from './steps/CleanerStep4';
import EmployerStep1 from './steps/EmployerStep1';
import EmployerStep2 from './steps/EmployerStep2';
import EmployerStep3 from './steps/EmployerStep3';
import WelcomeComplete from './steps/WelcomeComplete';

const OnboardingFlow = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const userRole = user?.role?.toLowerCase() || '';
  const isCleaner = userRole === 'cleaner' || userRole === 'candidate';
  const isEmployer = userRole === 'employer';

  // This effect handles authentication and redirects if onboarding is already complete
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (user?.profile_completed) {
      const dashboardPath = isEmployer ? '/employers-dashboard/dashboard' : '/candidates-dashboard/dashboard';
      router.push(dashboardPath);
    }
  }, [isAuthenticated, user, isEmployer, router]);

  // Defines the sequence of steps for each role
  const getSteps = () => {
    if (isCleaner) {
      return [
        { id: 1, title: 'Personal Info', component: CleanerStep1 },
        { id: 2, title: 'Professional', component: CleanerStep2 },
        { id: 3, title: 'Verification', component: CleanerStep3 },
        { id: 4, title: 'Pricing', component: CleanerStep4 },
        { id: 5, title: 'Complete', component: WelcomeComplete }
      ];
    } else if (isEmployer) {
      return [
        { id: 1, title: 'Business Info', component: EmployerStep1 },
        { id: 2, title: 'Location', component: EmployerStep2 },
        { id: 3, title: 'Needs', component: EmployerStep3 },
        { id: 4, title: 'Complete', component: WelcomeComplete }
      ];
    }
    return [];
  };

  const steps = getSteps();
  const totalSteps = steps.length;
  const progress = (currentStep / totalSteps) * 100;

  // This function is passed to each step to update the central form data
  const handleUpdateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
      
      // Remove error highlight class if present
      const element = document.querySelector(`[name="${field}"], #${field}`);
      if (element) {
        element.classList.remove('error-field');
      }
    }
  };

  // Validates the mandatory fields on Step 1
  const validateStep1 = () => {
    const stepErrors = {};
    let hasErrors = false;
    
    if (isCleaner) {
      if (!formData.name) stepErrors.name = 'Full Name is required.';
      if (!formData.phone_number) stepErrors.phone_number = 'Phone Number is required.';
    }
    // Add validation for Employer Step 1 if needed
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  // The single function that saves all collected data at the end
  const saveAllProgress = async () => {
    console.log('📋 Starting profile save process...');
    console.log('All form data collected:', formData);
    
    const saveResults = {
      backend: { success: [], failed: [] },
      localStorage: { success: [], failed: [] }
    };

    try {
      if (isCleaner) {
        await dispatch(saveCompleteCleanerProfile(formData)).unwrap();
      console.log('✅ Cleaner profile saved through slice');

      } else if (isEmployer) {
        // ===== EMPLOYER BACKEND FIELDS =====
        const userPayload = {};
        
        if (formData.name || formData.business_name) {
          userPayload.name = formData.name || formData.business_name;
          console.log('✅ Preparing to save NAME to backend:', userPayload.name);
        }
        
        if (formData.phone_number) {
          userPayload.phone_number = formData.phone_number;
          console.log('✅ Preparing to save PHONE to backend:', formData.phone_number);
        }
        
        if (formData.location || formData.address) {
          userPayload.address = formData.location || formData.address;
          console.log('✅ Preparing to save ADDRESS to backend:', userPayload.address);
        }

        // Save User fields
        if (Object.keys(userPayload).length > 0) {
          try {
            await patchCurrentUser(userPayload);
            saveResults.backend.success.push('Basic profile info');
            console.log('✅ User fields saved successfully');
          } catch (error) {
            saveResults.backend.failed.push('Basic profile info');
            console.error('❌ Failed to save user fields:', error.response?.data);
            throw new Error(`Couldn't save your basic information: ${JSON.stringify(error.response?.data || 'Unknown error')}`);
          }
        }

        // Employer Model Fields
        const employerPayload = {};
        
        if (formData.business_name) {
          employerPayload.company_name = formData.business_name;
          console.log('✅ Preparing to save COMPANY NAME to backend');
        }
        
        if (formData.about) {
          employerPayload.about = formData.about;
          console.log('✅ Preparing to save ABOUT to backend');
        }

        // Save Employer fields
        if (Object.keys(employerPayload).length > 0) {
          try {
            await patchEmployerMe(employerPayload);
            saveResults.backend.success.push('Business info');
            console.log('✅ Employer fields saved successfully');
          } catch (error) {
            saveResults.backend.failed.push('Business info');
            console.error('❌ Failed to save employer fields:', error.response?.data);
            throw new Error(`Couldn't save your business information: ${JSON.stringify(error.response?.data || 'Unknown error')}`);
          }
        }

        // Profile Picture
        if (formData.profile_picture instanceof File) {
          try {
            const picFormData = new FormData();
            picFormData.append('profile_picture', formData.profile_picture);
            await patchCurrentUserMultipart(picFormData);
            saveResults.backend.success.push('Profile picture');
            console.log('✅ Profile picture uploaded successfully');
          } catch (error) {
            saveResults.backend.failed.push('Profile picture');
            console.error('❌ Failed to upload profile picture:', error.response?.data);
          }
        }

        // ===== EMPLOYER LOCALSTORAGE FIELDS =====
        const localStorageFields = {};
        
        // Property details
        const propertyFields = [
          'account_type', 'property_type', 'property_size', 
          'bedrooms', 'bathrooms', 'parking_available', 
          'elevator_access', 'pets'
        ];
        
        propertyFields.forEach(field => {
          if (formData[field] !== undefined) {
            localStorageFields[field] = formData[field];
            console.log(`📦 Storing ${field} in localStorage:`, formData[field]);
          }
        });

        // Cleaning preferences
        const cleaningFields = [
          'access_instructions', 'cleaning_priorities', 
          'special_requirements', 'supplies_provided'
        ];
        
        cleaningFields.forEach(field => {
          if (formData[field] !== undefined) {
            localStorageFields[field] = formData[field];
            console.log(`📦 Storing ${field} in localStorage:`, formData[field]);
          }
        });

        // Service preferences
        const serviceFields = [
          'service_frequency', 'preferred_time', 
          'budget_min', 'budget_max', 'email_notifications'
        ];
        
        serviceFields.forEach(field => {
          if (formData[field] !== undefined) {
            localStorageFields[field] = formData[field];
            console.log(`📦 Storing ${field} in localStorage:`, formData[field]);
          }
        });

        // Save to localStorage
        if (Object.keys(localStorageFields).length > 0) {
          localStorage.setItem('employer_preferences', JSON.stringify(localStorageFields));
          saveResults.localStorage.success.push('Property & cleaning preferences');
          console.log('✅ All preferences saved to localStorage:', localStorageFields);
        }
      }

      // Summary
      console.log('====== SAVE SUMMARY ======');
      console.log('✅ Saved to backend:', saveResults.backend.success.join(', ') || 'Nothing');
      console.log('✅ Saved to localStorage:', saveResults.localStorage.success.join(', ') || 'Nothing');
      if (saveResults.backend.failed.length > 0) {
        console.log('❌ Failed backend saves:', saveResults.backend.failed.join(', '));
      }
      if (saveResults.localStorage.failed.length > 0) {
        console.log('❌ Failed localStorage saves:', saveResults.localStorage.failed.join(', '));
      }

    } catch (error) {
      console.error('Profile save failed:', error);
      throw error; // Re-throw with the human-readable message we added
    }
  };
  
  // Navigation handler for the "Next" button
  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) {
      toast.error('Please complete this required step before proceeding.');
      return;
    }
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  // Navigation handler for the "Previous" button
  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };
  
  // Navigation handler for the "Skip to Final Step" button
  const handleSkipToEnd = () => {
    if (currentStep === 1 && !validateStep1()) {
      toast.error('Please complete this required step before skipping.');
      return;
    }
    setCurrentStep(totalSteps);
  };

  // The final function that saves data and redirects
  const completeOnboarding = async () => {
    setLoading(true);
    try {
      await saveAllProgress();
      await patchCurrentUser({ profile_completed: true });
      await dispatch(fetchCurrentUser()).unwrap();
      
      toast.success('Welcome! Your profile is all set up.');
      
      const dashboardPath = isEmployer ? '/employers-dashboard/dashboard' : '/candidates-dashboard/dashboard';
      router.push(dashboardPath);

    } catch (error) {
      console.error('Profile setup error:', error);
      
      // Track which step has the error
      let errorStep = null;
      let fieldErrors = {};
      
      // Human-readable error messages
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Map error fields to their respective steps
        const fieldToStepMap = {
          // Step 1 fields (Personal/Business Info)
          'name': 1,
          'phone_number': 1,
          'business_name': 1,
          'email': 1,
          'gender': 1,
          'address': 1,
          'location': 1,
          
          // Step 2 fields (Professional/Location)
          'bio': 2,
          'portfolio': 2,
          'years_of_experience': 2,
          'dbs_check': 2,
          'insurance_details': 2,
          'clean_level': 2,
          'about': 2,
          
          // Step 3 fields (Verification/Needs)
          'skills': 3,
          'availability': 3,
          'hourly_rate': 3,
          
          // Profile picture can be on any step
          'profile_picture': currentStep,
        };
        
        // Process each error field
        Object.keys(errorData).forEach(field => {
          const message = Array.isArray(errorData[field]) ? errorData[field][0] : errorData[field];
          
          // Add to fieldErrors for highlighting
          fieldErrors[field] = message;
          
          // Find which step this field belongs to
          if (fieldToStepMap[field] && !errorStep) {
            errorStep = fieldToStepMap[field];
          }
          
          // Show specific error messages with icons
          if (field === 'phone_number') {
            toast.error(`📱 Phone number: ${message}`, { autoClose: 5000 });
          } else if (field === 'email') {
            toast.error(`📧 Email: ${message}`, { autoClose: 5000 });
          } else if (field === 'name' || field === 'business_name') {
            toast.error(`👤 Name: ${message}`, { autoClose: 5000 });
          } else if (field === 'address' || field === 'location') {
            toast.error(`📍 Location: ${message}`, { autoClose: 5000 });
          } else if (field === 'detail') {
            toast.error(`⚠️ ${message}`, { autoClose: 5000 });
          } else {
            toast.error(`❌ ${field.replace(/_/g, ' ')}: ${message}`, { autoClose: 5000 });
          }
        });
        
        // Set errors for field highlighting
        setErrors(fieldErrors);
        
        // Navigate to the step with errors
        if (errorStep && errorStep !== currentStep) {
          setCurrentStep(errorStep);
          toast.info(`📍 Navigated to Step ${errorStep} to fix the errors`, { 
            position: "top-center",
            autoClose: 3000 
          });
          
          // Scroll to top of the page
          window.scrollTo({ top: 0, behavior: 'smooth' });
          
          // After a short delay, highlight the first error field
          setTimeout(() => {
            const firstErrorField = Object.keys(fieldErrors)[0];
            const element = document.querySelector(`[name="${firstErrorField}"], #${firstErrorField}`);
            if (element) {
              element.focus();
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              
              // Add visual highlight animation
              element.classList.add('error-highlight');
              setTimeout(() => {
                element.classList.remove('error-highlight');
              }, 3000);
            }
          }, 500);
        }
        
      } else if (error.message) {
        // Handle custom error messages
        if (error.message.includes('basic information')) {
          errorStep = 1;
        } else if (error.message.includes('professional information')) {
          errorStep = 2;
        } else if (error.message.includes('business information')) {
          errorStep = isCleaner ? 2 : 1;
        }
        
        toast.error(error.message, { autoClose: 5000 });
        
        if (errorStep && errorStep !== currentStep) {
          setCurrentStep(errorStep);
          toast.info(`📍 Please fix the errors in Step ${errorStep}`, { 
            position: "top-center",
            autoClose: 3000 
          });
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        toast.error('❌ Unable to complete profile setup. Please check your information and try again.', {
          autoClose: 5000
        });
      }
      
    } finally {
      setLoading(false);
    }
  };

  const CurrentStepComponent = steps.length > 0 ? steps[currentStep - 1]?.component : null;
  const isLastStep = currentStep === totalSteps;
  const showHeaderSkipButton = currentStep > 1 && !isLastStep;

  return (
    <div className="onboarding-container">
      <div className="onboarding-header">
        <div className="header-content">
          <Image src="/images/logo.png" alt="TidyLinker" width={40} height={40} className="logo"/>
          
          {/* This button is now correctly shown only AFTER step 1 */}
          {showHeaderSkipButton && (
            <button onClick={handleSkipToEnd} className="skip-btn">
              Skip to Final Step
            </button>
          )}
        </div>
      </div>

      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="step-indicators">
          {steps.map((step, index) => (
            <div key={step.id} className={`step-dot ${index + 1 <= currentStep ? 'active' : ''} ${index + 1 === currentStep ? 'current' : ''}`}>
              <span className="step-number">{index + 1}</span>
              <span className="step-title">{step.title}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="onboarding-content">
        {CurrentStepComponent ? (
          <CurrentStepComponent formData={formData} errors={errors} onUpdate={handleUpdateField} userRole={userRole} />
        ) : (
          <div>Loading steps...</div>
        )}
      </div>

      <div className="onboarding-navigation">
        <button onClick={handlePrevious} disabled={currentStep === 1 || loading} className="btn btn-secondary" style={{ visibility: isLastStep || currentStep === 1 ? 'hidden' : 'visible' }}>
          Previous
        </button>
        
        {/* The middle button is now permanently removed */}

        {isLastStep ? (
          <button onClick={completeOnboarding} disabled={loading} className="btn btn-primary">
            {loading ? 'Saving...' : 'Complete & Go to Dashboard'}
          </button>
        ) : (
          <button onClick={handleNext} disabled={loading} className="btn btn-primary">
            Next
          </button>
        )}
      </div>
      <style jsx>{`
        .onboarding-container{min-height:100vh;background:linear-gradient(135deg,#f0f9f7 0%,#e8f5f3 100%)}.onboarding-header{background:white;padding:20px 0;box-shadow:0 2px 10px rgba(0,0,0,.05)}.header-content{max-width:1200px;margin:0 auto;padding:0 20px;display:flex;justify-content:space-between;align-items:center}.skip-btn{color:#6b7280;background:transparent;border:none;font-size:14px;cursor:pointer;font-weight:500;}.skip-btn:hover{color:#4b9b97;text-decoration:underline;}.progress-container{max-width:800px;margin:40px auto;padding:0 20px}.progress-bar{height:6px;background:#e5e7eb;border-radius:999px;overflow:hidden;margin-bottom:30px}.progress-fill{height:100%;background:linear-gradient(90deg,#4b9b97 0%,#6bc4c0 100%);border-radius:999px;transition:width .5s ease}.step-indicators{display:flex;justify-content:space-between}.step-dot{display:flex;flex-direction:column;align-items:center;opacity:.5;transition:all .3s ease}.step-dot.active{opacity:1}.step-dot.current .step-number{background:#4b9b97;color:white;transform:scale(1.2)}.step-number{width:32px;height:32px;border-radius:50%;background:#e5e7eb;color:#6b7280;display:flex;align-items:center;justify-content:center;font-weight:600;margin-bottom:8px;transition:all .3s ease}.step-title{font-size:12px;color:#6b7280}.onboarding-content{max-width:800px;margin:0 auto;padding:0 20px 120px}.onboarding-navigation{position:fixed;bottom:0;left:0;right:0;background:white;border-top:1px solid #e5e7eb;padding:20px;display:flex;justify-content:flex-end;align-items:center;gap:20px;z-index:100}.onboarding-navigation > *:first-child{margin-right:auto}.btn{padding:14px 32px;border-radius:8px;font-size:16px;font-weight:600;cursor:pointer;transition:all .3s ease;border:none;min-width:120px}.btn-primary{background:linear-gradient(135deg,#4b9b97 0%,#6bc4c0 100%);color:white}.btn-primary:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 4px 12px rgba(75,155,151,.3)}.btn-secondary{background:white;color:#4b9b97;border:2px solid #4b9b97}.btn:disabled{opacity:.5;cursor:not-allowed}@media (max-width:640px){.step-title{display:none}.onboarding-navigation{padding:15px}.btn{padding:12px 24px;font-size:14px}}

        /* Error field highlighting */
        :global(.error-field) {
          border: 2px solid #ef4444 !important;
          background-color: #fef2f2 !important;
          animation: shake 0.5s;
        }
        
        :global(.error-highlight) {
          animation: pulse-error 2s;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        @keyframes pulse-error {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          50% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        
        :global(.error-message) {
          color: #ef4444;
          font-size: 12px;
          margin-top: 4px;
          display: block;
        }
      `}</style>
    </div>
  );
};
export default OnboardingFlow;