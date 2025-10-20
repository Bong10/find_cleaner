"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import DefaulHeader from "@/components/header/DefaulHeader2";
import MobileMenu from "@/components/header/MobileMenu";
import FooterDefault from "@/components/footer/common-footer";
import { fetchMyJobs, selectMyJobs } from "@/store/slices/myJobsSlice";
import { 
  updateJobField, 
  setJobServices, 
  resetJobForm, 
  submitJob,
  selectJobForm,
  selectJobSubmitting,
  selectJobCreated
} from "@/store/slices/jobsSlice";
import { createBooking } from "@/store/slices/bookingSlice";
import { loadServices } from "@/store/slices/servicesSlice";
import Image from "next/image";

// Import booking steps components
import BookingProgress from "@/components/booking/BookingProgress";
import CleanerCard from "@/components/booking/CleanerCard";
import SelectionStep from "@/components/booking/SelectionStep";
import JobListStep from "@/components/booking/JobListStep";
import JobFormStep from "@/components/booking/JobFormStep";
import ConfirmationStep from "@/components/booking/ConfirmationStep";

const BookCleanerPage = ({ params }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const cleanerId = params.id;
  
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingMode, setBookingMode] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cleanerData, setCleanerData] = useState(null);
  const [openJobs, setOpenJobs] = useState([]);
  const [newJobId, setNewJobId] = useState(null);
  const [bookingCompleted, setBookingCompleted] = useState(false);
  
  // Redux state
  const { user, isAuthenticated } = useSelector((state) => state.auth) || {};
  
  // Get jobs from myJobsSlice
  const { items: allJobs = [], status: jobsStatus } = useSelector(selectMyJobs);
  const jobsLoading = jobsStatus === "loading";
  
  // Get booking state
  const { loading: bookingLoading, error: bookingError } = useSelector((state) => state.bookings);
  
  // Get job form state from jobsSlice
  const jobForm = useSelector(selectJobForm);
  const jobSubmitting = useSelector(selectJobSubmitting);
  const createdJob = useSelector(selectJobCreated);
  
  // Get services from servicesSlice
  const { list: services, loading: servicesLoading } = useSelector((state) => state.services);
  
  // Check if user is employer
  const roleName = String(user?.role || "").toLowerCase();
  const isEmployer = roleName === "employer";
  
  useEffect(() => {
    // Filter only open jobs
    const filteredOpenJobs = allJobs.filter(job => {
      const status = String(job.status || '').toLowerCase();
      return status === 'o' || status === 'open';
    });
    
    setOpenJobs(filteredOpenJobs);
  }, [allJobs]);
  
  useEffect(() => {
    // Check authentication and role
    if (!isAuthenticated) {
      toast.error("Please login to continue");
      router.push(`/login?redirect=/book-cleaner/${cleanerId}`);
      return;
    }
    
    if (!isEmployer) {
      toast.error("Only employers can book cleaners");
      router.push('/');
      return;
    }
    
    // Get cleaner data
    const storedCleaner = localStorage.getItem('selectedCleaner');
    if (storedCleaner) {
      try {
        const cleaner = JSON.parse(storedCleaner);
        setCleanerData(cleaner);
      } catch (error) {
        console.error("Error parsing cleaner data:", error);
        toast.error("Cleaner data not found");
        router.push('/candidates-list-v1');
      }
    } else {
      toast.error("Please select a cleaner first");
      router.push('/candidates-list-v1');
    }
    
    // Fetch jobs using myJobsSlice
    dispatch(fetchMyJobs({ months: 6, refresh: true }));
    
    // Load services from backend using servicesSlice
    if (!services || services.length === 0) {
      dispatch(loadServices());
    }
    
    // Reset job form
    dispatch(resetJobForm());
  }, [dispatch, isAuthenticated, isEmployer, cleanerId, router]);
  
  // Handle when job is created successfully for new job booking
  useEffect(() => {
    if (createdJob && bookingMode === "create" && !newJobId && !bookingCompleted) {
      const jobId = createdJob.id || createdJob.job_id || createdJob.pk;
      
      if (jobId) {
        setNewJobId(jobId);
        
        // Create booking immediately without additional messages
        dispatch(createBooking({ 
          jobId: parseInt(jobId), 
          cleanerId: parseInt(cleanerId) 
        })).unwrap()
          .then(() => {
            setBookingCompleted(true);
            // Single success message
            toast.success("Cleaner successfully booked!");
            // Quick redirect
            setTimeout(() => {
              router.push('/employers-dashboard/manage-jobs');
            }, 500);
          })
          .catch((error) => {
            toast.error(`Booking failed: ${error}`);
            setIsSubmitting(false);
          });
      } else {
        toast.error("Failed to create job");
        setIsSubmitting(false);
      }
    }
  }, [createdJob, bookingMode, newJobId, bookingCompleted, dispatch, cleanerId, router]);
  
  // Handle booking error
  useEffect(() => {
    if (bookingError && isSubmitting && !bookingCompleted) {
      toast.error(bookingError);
      setIsSubmitting(false);
    }
  }, [bookingError, isSubmitting, bookingCompleted]);
  
  const handleModeSelection = (mode) => {
    setBookingMode(mode);
    if (mode === "existing" && (!openJobs || openJobs.length === 0)) {
      toast.info("You don't have any open jobs. Let's create one!");
      setBookingMode("create");
      setCurrentStep(2);
    } else {
      setCurrentStep(2);
    }
  };
  
  const handleJobSelection = (job) => {
    setSelectedJob(job);
    setCurrentStep(3);
  };
  
  const handleCreateJobNext = () => {
    // Validate the form before proceeding
    const f = jobForm;
    
    if (!f.title?.trim()) {
      toast.error("Please enter a job title");
      return;
    }
    if (!f.description?.trim()) {
      toast.error("Please enter a job description");
      return;
    }
    if (!f.location?.trim()) {
      toast.error("Please enter a location");
      return;
    }
    if (!f.date) {
      toast.error("Please select a date");
      return;
    }
    if (!f.time) {
      toast.error("Please select a time");
      return;
    }
    if (!f.services || f.services.length === 0) {
      toast.error("Please select at least one service");
      return;
    }
    
    setCurrentStep(3);
  };
  
  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    
    try {
      if (bookingMode === "existing") {
        // Book with existing job
        const jobId = selectedJob.job_id || selectedJob.id || selectedJob.pk;
        
        if (!jobId) {
          throw new Error("Job ID not found");
        }
        
        // Create booking
        await dispatch(createBooking({ 
          jobId: parseInt(jobId), 
          cleanerId: parseInt(cleanerId) 
        })).unwrap();
        
        setBookingCompleted(true);
        // Single success message
        toast.success("Cleaner successfully booked!");
        // Quick redirect
        setTimeout(() => {
          router.push('/employers-dashboard/manage-jobs');
        }, 500);
        
      } else {
        // Create new job - the booking will be handled in useEffect
        setNewJobId(null);
        setBookingCompleted(false);
        dispatch(submitJob());
      }
      
    } catch (error) {
      console.error("Booking failed:", error);
      toast.error(`Booking failed: ${error.message || error}`);
      setIsSubmitting(false);
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  return (
    <>
      <style jsx global>{`
        .booking-page {
          background: linear-gradient(135deg, #f0fffe 0%, #e6f9f8 100%);
          min-height: 100vh;
          padding: 40px 0;
        }
        
        .booking-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        
        .booking-header {
          text-align: center;
          margin-bottom: 50px;
          animation: fadeInDown 0.6s ease;
        }
        
        .booking-title {
          font-size: 48px;
          font-weight: 800;
          background: linear-gradient(135deg, #4C9A99 0%, #2d5f5f 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 10px;
          letter-spacing: -1px;
        }
        
        .booking-subtitle {
          font-size: 18px;
          color: #64748b;
          font-weight: 400;
        }
        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .step-animation {
          animation: fadeIn 0.5s ease;
        }
        
        @media (max-width: 768px) {
          .booking-title {
            font-size: 32px;
          }
          
          .booking-subtitle {
            font-size: 16px;
          }
        }
      `}</style>
      
      <DefaulHeader />
      <MobileMenu />
      
      <div className="booking-page">
        <div className="booking-container">
          <div className="booking-header">
            <h1 className="booking-title">
              {currentStep === 1 && "Let's Get Started"}
              {currentStep === 2 && "Choose Your Job"}
              {currentStep === 3 && "Almost There!"}
            </h1>
            <p className="booking-subtitle">
              {currentStep === 1 && "Select how you'd like to book your cleaner"}
              {currentStep === 2 && bookingMode === "existing" && `${openJobs.length} open job${openJobs.length !== 1 ? 's' : ''} available`}
              {currentStep === 2 && bookingMode === "create" && "Create a new cleaning job"}
              {currentStep === 3 && "Review and confirm your booking details"}
            </p>
          </div>
          
          <BookingProgress currentStep={currentStep} />
          
          {cleanerData && (
            <CleanerCard cleaner={cleanerData} cleanerId={cleanerId} />
          )}
          
          <div className="step-animation">
            {currentStep === 1 && (
              <SelectionStep 
                onSelectMode={handleModeSelection}
                jobsCount={openJobs.length}
              />
            )}
            
            {currentStep === 2 && bookingMode === "existing" && (
              <JobListStep 
                jobs={openJobs}
                loading={jobsLoading}
                onSelectJob={handleJobSelection}
                onBack={handleBack}
                onCreateNew={() => {
                  setBookingMode("create");
                  setCurrentStep(2);
                }}
              />
            )}
            
            {currentStep === 2 && bookingMode === "create" && (
              <JobFormStep
                jobForm={jobForm}
                services={services}
                servicesLoading={servicesLoading}
                dispatch={dispatch}
                updateJobField={updateJobField}
                setJobServices={setJobServices}
                onNext={handleCreateJobNext}
                onBack={handleBack}
              />
            )}
            
            {currentStep === 3 && (
              <ConfirmationStep
                cleaner={cleanerData}
                cleanerId={cleanerId}
                selectedJob={selectedJob}
                jobForm={jobForm}
                bookingMode={bookingMode}
                isSubmitting={isSubmitting || bookingLoading || jobSubmitting}
                onConfirm={handleConfirmBooking}
                onBack={() => setCurrentStep(2)}
              />
            )}
          </div>
        </div>
      </div>
      
      <FooterDefault />
    </>
  );
};

export default BookCleanerPage;
