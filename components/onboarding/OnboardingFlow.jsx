// components/onboarding/OnboardingFlow.jsx
"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Image from 'next/image';

// Import services and Redux actions
import { fetchCurrentUser } from '@/store/slices/authSlice';
import { patchCurrentUser, patchCurrentUserMultipart, patchCleanerMe } from '@/services/cleanerService';
import { patchEmployerMe } from '@/services/employerService';

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
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Validates the mandatory fields on Step 1
  const validateStep1 = () => {
    const stepErrors = {};
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
    if (isCleaner) {
      const userPayload = {
        name: formData.name,
        phone_number: formData.phone_number,
        gender: formData.gender,
        address: formData.address,
      };
      
      const cleanerPayload = {
        portfolio: formData.bio || '',
        years_of_experience: parseInt(formData.years_of_experience) || 0,
        dbs_check: formData.dbs_check || false,
        insurance_details: formData.insurance_details || '',
        clean_level: parseInt(formData.clean_level) || 0,
      };

      // API Calls
      await patchCurrentUser(userPayload);
      await patchCleanerMe(cleanerPayload);

      if (formData.profile_picture instanceof File) {
        const picFormData = new FormData();
        picFormData.append('profile_picture', formData.profile_picture);
        await patchCurrentUserMultipart(picFormData);
      }
    }
    // Add Employer save logic here later
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
      await dispatch(fetchCurrentUser()).unwrap(); // Wait for Redux state to update
      
      toast.success('Welcome! Your profile is complete.');
      
      const dashboardPath = isEmployer ? '/employers-dashboard/dashboard' : '/candidates-dashboard/dashboard';
      router.push(dashboardPath);

    } catch (error) {
      toast.error('Failed to complete onboarding. Please try again.');
      console.error('Complete onboarding error:', error);
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
      `}</style>
    </div>
  );
};
export default OnboardingFlow;