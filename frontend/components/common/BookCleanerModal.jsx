// components/common/BookCleanerModal.jsx
"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Form, Button, Alert, Spinner } from "react-bootstrap";
import { bookCleaner, createAndBookCleaner } from "@/store/slices/bookingSlice";
import { fetchEmployerJobs } from "@/store/slices/employerJobsSlice";
import { selectJobForm, updateJobField, setJobServices } from "@/store/slices/jobsSlice";
import { fetchServices } from "@/store/slices/servicesSlice";
import { toast } from "react-toastify";

const BookCleanerModal = ({ show, onHide, cleaner }) => {
  const dispatch = useDispatch();
  const [mode, setMode] = useState("existing"); // 'existing' or 'create'
  const [selectedJob, setSelectedJob] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [localJobs, setLocalJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  
  // Get employer's jobs from the employer slice if it exists
  const employerJobs = useSelector(state => state.employer?.jobs?.data) || [];
  
  // Get booking state
  const { loading: bookingLoading, error } = useSelector(state => state.booking) || {};
  
  // For creating new job
  const jobForm = useSelector(selectJobForm);
  const { list: services = [], loading: servicesLoading } = useSelector(state => state.services) || {};
  
  // Fetch jobs when modal opens
  useEffect(() => {
    const fetchJobs = async () => {
      if (show && mode === "existing") {
        setJobsLoading(true);
        try {
          // Try to fetch employer's jobs
          const response = await dispatch(fetchEmployerJobs()).unwrap();
          const jobs = response?.results || response?.data || response || [];
          setLocalJobs(Array.isArray(jobs) ? jobs : []);
        } catch (error) {
          console.error("Error fetching jobs:", error);
          // Try to get from localStorage as fallback
          const storedJobs = localStorage.getItem('employer_jobs');
          if (storedJobs) {
            try {
              const parsed = JSON.parse(storedJobs);
              setLocalJobs(Array.isArray(parsed) ? parsed : []);
            } catch {
              setLocalJobs([]);
            }
          } else {
            setLocalJobs([]);
          }
        } finally {
          setJobsLoading(false);
        }
      }
    };
    
    fetchJobs();
  }, [show, mode, dispatch]);
  
  // Fetch services when modal opens for create mode
  useEffect(() => {
    if (show && mode === "create" && services.length === 0) {
      dispatch(fetchServices());
    }
  }, [show, mode, services.length, dispatch]);
  
  // Use either employer jobs or local jobs
  const jobs = employerJobs.length > 0 ? employerJobs : localJobs;
  
  const handleSubmit = async () => {
    if (mode === "existing") {
      if (!selectedJob) {
        toast.warning("Please select a job");
        return;
      }
      setShowConfirm(true);
    } else {
      // Validate new job form
      if (!jobForm.title || !jobForm.description || !jobForm.location || 
          !jobForm.date || !jobForm.time || !jobForm.services || jobForm.services.length === 0) {
        toast.warning("Please fill all required fields");
        return;
      }
      setShowConfirm(true);
    }
  };
  
  const confirmBooking = async () => {
    try {
      if (mode === "existing") {
        await dispatch(bookCleaner({ 
          job: selectedJob, 
          cleaner: cleaner.id 
        })).unwrap();
      } else {
        await dispatch(createAndBookCleaner({ 
          jobData: jobForm, 
          cleanerId: cleaner.id 
        })).unwrap();
      }
      
      setShowConfirm(false);
      onHide();
      // Show success message or redirect to booking details
    } catch (err) {
      console.error("Booking failed:", err);
    }
  };
  
  // Get selected job details
  const getSelectedJobDetails = () => {
    if (!selectedJob || !Array.isArray(jobs)) return null;
    return jobs.find(j => String(j.id) === String(selectedJob));
  };
  
  return (
    <>
      <Modal show={show && !showConfirm} onHide={onHide} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Book {cleaner?.name || "Cleaner"}</Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <div className="mb-3">
            <div className="btn-group w-100" role="group">
              <button
                type="button"
                className={`btn ${mode === "existing" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setMode("existing")}
              >
                Select Existing Job
              </button>
              <button
                type="button"
                className={`btn ${mode === "create" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setMode("create")}
              >
                Create New Job
              </button>
            </div>
          </div>
          
          {mode === "existing" ? (
            <div>
              <h5>Select a Job</h5>
              {jobsLoading ? (
                <div className="text-center py-3">
                  <Spinner animation="border" />
                  <p className="mt-2">Loading your jobs...</p>
                </div>
              ) : !Array.isArray(jobs) || jobs.length === 0 ? (
                <Alert variant="info">
                  No active jobs found. Please create a new job to book this cleaner.
                  <Button 
                    variant="link" 
                    onClick={() => setMode("create")}
                    className="p-0 mt-2 d-block"
                  >
                    Create New Job →
                  </Button>
                </Alert>
              ) : (
                <Form.Select 
                  value={selectedJob} 
                  onChange={(e) => setSelectedJob(e.target.value)}
                  className="mb-3"
                >
                  <option value="">-- Select a Job --</option>
                  {jobs.map(job => (
                    <option key={job.id} value={job.id}>
                      {job.title || "Untitled"} - {job.date || "No date"} at {job.time || "No time"}
                      {job.location ? ` (${job.location})` : ""}
                    </option>
                  ))}
                </Form.Select>
              )}
            </div>
          ) : (
            <div>
              <h5>Create New Job</h5>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Job Title*</Form.Label>
                  <Form.Control
                    type="text"
                    value={jobForm?.title || ""}
                    onChange={(e) => dispatch(updateJobField({ 
                      name: 'title', 
                      value: e.target.value 
                    }))}
                    placeholder="e.g., Office Cleaning"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Description*</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={jobForm?.description || ""}
                    onChange={(e) => dispatch(updateJobField({ 
                      name: 'description', 
                      value: e.target.value 
                    }))}
                    placeholder="Describe the cleaning job requirements..."
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Location*</Form.Label>
                  <Form.Control
                    type="text"
                    value={jobForm?.location || ""}
                    onChange={(e) => dispatch(updateJobField({ 
                      name: 'location', 
                      value: e.target.value 
                    }))}
                    placeholder="Enter job location"
                  />
                </Form.Group>
                
                <div className="row">
                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label>Date*</Form.Label>
                      <Form.Control
                        type="date"
                        value={jobForm?.date || ""}
                        onChange={(e) => dispatch(updateJobField({ 
                          name: 'date', 
                          value: e.target.value 
                        }))}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </Form.Group>
                  </div>
                  
                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label>Time*</Form.Label>
                      <Form.Control
                        type="time"
                        value={jobForm?.time || ""}
                        onChange={(e) => dispatch(updateJobField({ 
                          name: 'time', 
                          value: e.target.value 
                        }))}
                      />
                    </Form.Group>
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label>Hourly Rate (£)</Form.Label>
                      <Form.Control
                        type="number"
                        value={jobForm?.hourly_rate || ""}
                        onChange={(e) => dispatch(updateJobField({ 
                          name: 'hourly_rate', 
                          value: e.target.value 
                        }))}
                        min="0"
                        step="0.01"
                        placeholder="20"
                      />
                    </Form.Group>
                  </div>
                  
                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label>Hours Required</Form.Label>
                      <Form.Control
                        type="number"
                        value={jobForm?.hours_required || 1}
                        onChange={(e) => dispatch(updateJobField({ 
                          name: 'hours_required', 
                          value: e.target.value 
                        }))}
                        min="1"
                      />
                    </Form.Group>
                  </div>
                </div>
                
                <Form.Group className="mb-3">
                  <Form.Label>Services Required*</Form.Label>
                  {servicesLoading ? (
                    <div className="text-center py-2">
                      <Spinner size="sm" /> Loading services...
                    </div>
                  ) : services.length > 0 ? (
                    <div>
                      {services.map(service => (
                        <Form.Check
                          key={service.id}
                          type="checkbox"
                          id={`service-${service.id}`}
                          label={service.name}
                          checked={jobForm?.services?.includes(service.id) || false}
                          onChange={(e) => {
                            const currentServices = jobForm?.services || [];
                            const newServices = e.target.checked
                              ? [...currentServices, service.id]
                              : currentServices.filter(id => id !== service.id);
                            dispatch(setJobServices(newServices));
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <Alert variant="warning">
                      No services available. Please try again later.
                    </Alert>
                  )}
                </Form.Group>
              </Form>
            </div>
          )}
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={bookingLoading}
          >
            {bookingLoading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Processing...
              </>
            ) : (
              "Continue to Confirm"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Confirmation Modal */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Booking</Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          <h5>Booking Summary</h5>
          <div className="border rounded p-3 mb-3">
            <p><strong>Cleaner:</strong> {cleaner?.name}</p>
            <p><strong>Rating:</strong> ⭐ {cleaner?.rating || "N/A"}</p>
            <p><strong>Hourly Rate:</strong> £{cleaner?.hourly_rate || jobForm?.hourly_rate || "20"}/hr</p>
            
            {mode === "existing" && selectedJob && (
              <>
                {getSelectedJobDetails() && (
                  <>
                    <p><strong>Job:</strong> {getSelectedJobDetails().title}</p>
                    <p><strong>Date:</strong> {getSelectedJobDetails().date}</p>
                    <p><strong>Time:</strong> {getSelectedJobDetails().time}</p>
                    <p><strong>Location:</strong> {getSelectedJobDetails().location}</p>
                  </>
                )}
              </>
            )}
            
            {mode === "create" && (
              <>
                <p><strong>Job:</strong> {jobForm?.title}</p>
                <p><strong>Date:</strong> {jobForm?.date}</p>
                <p><strong>Time:</strong> {jobForm?.time}</p>
                <p><strong>Location:</strong> {jobForm?.location}</p>
                <p><strong>Hours:</strong> {jobForm?.hours_required || 1}</p>
              </>
            )}
          </div>
          
          <Alert variant="info">
            <strong>What happens next?</strong>
            <ul className="mb-0 mt-2">
              <li>The cleaner will be notified of your booking request</li>
              <li>They will review and confirm availability</li>
              <li>Once confirmed, a chat will be opened for coordination</li>
              <li>Payment will be processed after job completion</li>
            </ul>
          </Alert>
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Back
          </Button>
          <Button 
            variant="success" 
            onClick={confirmBooking}
            disabled={bookingLoading}
          >
            {bookingLoading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Booking...
              </>
            ) : (
              "Confirm Booking"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BookCleanerModal;