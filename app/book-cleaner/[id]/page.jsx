"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import DefaulHeader from "@/components/header/DefaulHeader2";
import MobileMenu from "@/components/header/MobileMenu";
import FooterDefault from "@/components/footer/common-footer";
import { fetchMyJobs, selectMyJobs } from "@/store/slices/myJobsSlice";
import { updateJobField, setJobServices, resetJobForm } from "@/store/slices/jobsSlice";
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
  const [services, setServices] = useState([]);
  const [openJobs, setOpenJobs] = useState([]);
  
  // Redux state
  const { user, isAuthenticated } = useSelector((state) => state.auth) || {};
  
  // Get jobs from myJobsSlice
  const { items: allJobs = [], status: jobsStatus } = useSelector(selectMyJobs);
  const jobsLoading = jobsStatus === "loading";
  
  // Job form state
  const jobForm = useSelector((state) => state.jobs?.form) || {
    title: "",
    description: "",
    location: "",
    date: "",
    time: "",
    hourly_rate: "",
    hours_required: 1,
    services: [],
  };
  
  // Check if user is employer
  const roleName = String(user?.role || "").toLowerCase();
  const isEmployer = roleName === "employer";
  
  useEffect(() => {
    // Filter only open jobs (status 'o' or 'open')
    const filteredOpenJobs = allJobs.filter(job => {
      const status = String(job.status || '').toLowerCase();
      // Only consider jobs with status 'o' or 'open' as truly open
      return status === 'o' || status === 'open';
    });
    
    console.log('All jobs:', allJobs.length, 'Open jobs:', filteredOpenJobs.length);
    console.log('Job statuses:', allJobs.map(j => ({ title: j.title, status: j.status })));
    
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
    
    // Fetch jobs using myJobsSlice pattern - with refresh to get latest status
    dispatch(fetchMyJobs({ months: 6, refresh: true }));
    
    // Fetch services directly from API
    fetchServices();
    
    // Reset job form
    if (typeof resetJobForm === 'function') {
      dispatch(resetJobForm());
    }
  }, [dispatch, isAuthenticated, isEmployer, cleanerId, router]);
  
  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://cgsabiozard.co.uk'}/api/services/`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setServices(data.results || data || []);
      } else {
        // Use default services if API fails
        setServices([
          { id: 1, name: "House Cleaning" },
          { id: 2, name: "Office Cleaning" },
          { id: 3, name: "Deep Cleaning" },
          { id: 4, name: "Window Cleaning" },
          { id: 5, name: "Carpet Cleaning" },
          { id: 6, name: "End of Tenancy Cleaning" },
          { id: 7, name: "After Builders Cleaning" },
          { id: 8, name: "Move In/Out Cleaning" }
        ]);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      // Use default services
      setServices([
        { id: 1, name: "House Cleaning" },
        { id: 2, name: "Office Cleaning" },
        { id: 3, name: "Deep Cleaning" },
        { id: 4, name: "Window Cleaning" },
        { id: 5, name: "Carpet Cleaning" },
        { id: 6, name: "End of Tenancy Cleaning" },
        { id: 7, name: "After Builders Cleaning" },
        { id: 8, name: "Move In/Out Cleaning" }
      ]);
    }
  };
  
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
    setCurrentStep(3);
  };
  
  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('access_token');
      
      if (bookingMode === "existing") {
        // Get the job ID - checking different possible field names
        const jobId = selectedJob.job_id || selectedJob.id || selectedJob.pk;
        
        console.log("Booking with existing job:", {
          job: jobId,
          cleaner: parseInt(cleanerId),
          selectedJob: selectedJob
        });
        
        // First, create the booking/application
        const bookingResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/job-bookings/book/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            job: parseInt(jobId),
            cleaner: parseInt(cleanerId),
            status: 'accepted', // Set as accepted immediately since employer is booking
            cover_letter: `Direct booking by employer for ${selectedJob.title}`
          })
        });
        
        const bookingData = await bookingResponse.json();
        console.log("Booking response:", bookingData);
        
        if (bookingResponse.ok) {
          // Update job status to taken
          const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/jobs/${jobId}/`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              status: 't' // 't' for taken
            })
          });
          
          if (updateResponse.ok) {
            toast.success("🎉 Cleaner booked successfully! Job status updated to Taken.");
            // Refresh jobs to get updated status
            dispatch(fetchMyJobs({ months: 6, refresh: true }));
            router.push('/employers-dashboard/manage-jobs');
          } else {
            // Booking created but status update failed - still navigate
            toast.success("🎉 Cleaner booked successfully!");
            router.push('/employers-dashboard/manage-jobs');
          }
        } else {
          // Check if it's a duplicate booking error
          if (bookingData.detail?.includes('already') || bookingData.non_field_errors) {
            toast.warning("This cleaner has already been booked for this job.");
          } else {
            throw new Error(bookingData.detail || bookingData.error || "Booking failed");
          }
        }
      } else {
        // Create job first
        const jobData = {
          title: jobForm.title,
          description: jobForm.description,
          location: jobForm.location,
          date: jobForm.date,
          time: jobForm.time,
          hourly_rate: parseFloat(jobForm.hourly_rate) || 20,
          hours_required: parseInt(jobForm.hours_required) || 1,
          services: jobForm.services.map(id => parseInt(id)),
          status: 'o' // Start as open
        };
        
        console.log("Creating job with data:", jobData);
        
        const jobResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/jobs/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(jobData)
        });
        
        const jobResponseData = await jobResponse.json();
        console.log("Job creation response:", jobResponseData);
        
        if (jobResponse.ok) {
          const newJob = jobResponseData;
          
          // Create booking/application for the new job
          console.log("Booking cleaner with new job:", {
            job: newJob.id,
            cleaner: parseInt(cleanerId)
          });
          
          const bookingResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/job-applications/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              job: parseInt(newJob.id),
              cleaner: parseInt(cleanerId),
              status: 'accepted',
              cover_letter: `Direct booking by employer for ${newJob.title}`
            })
          });
          
          const bookingResponseData = await bookingResponse.json();
          console.log("Booking response:", bookingResponseData);
          
          if (bookingResponse.ok) {
            // Update the newly created job status to taken
            const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/jobs/${newJob.id}/`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                status: 't' // 't' for taken
              })
            });
            
            if (updateResponse.ok) {
              toast.success("🎉 Job created and cleaner booked successfully!");
              dispatch(fetchMyJobs({ months: 6, refresh: true }));
              router.push('/employers-dashboard/manage-jobs');
            } else {
              // Job and booking created but status update failed
              toast.success("🎉 Job created and cleaner booked!");
              router.push('/employers-dashboard/manage-jobs');
            }
          } else {
            throw new Error(bookingResponseData.detail || bookingResponseData.error || "Booking failed");
          }
        } else {
          throw new Error(jobResponseData.detail || jobResponseData.error || "Job creation failed");
        }
      }
    } catch (error) {
      console.error("Booking failed:", error);
      toast.error(error.message || "Booking failed. Please try again.");
    } finally {
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
                jobsCount={openJobs.length} // Pass open jobs count, not all jobs
              />
            )}
            
            {currentStep === 2 && bookingMode === "existing" && (
              <JobListStep 
                jobs={openJobs} // Pass only open jobs
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
                dispatch={dispatch}
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
                isSubmitting={isSubmitting}
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
