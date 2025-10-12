// components/candidates-single-pages/shared-components/BookingModal.jsx
"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { fetchEmployerJobs, assignCleanerToJob } from "@/store/slices/employerJobsSlice";
import { createJobAndAssign } from "@/store/slices/jobsSlice";

const BookingModal = ({ show, onClose, cleaner }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { jobs, loading } = useSelector((state) => state.employerJobs);
  
  const [activeTab, setActiveTab] = useState("existing"); // "existing" or "new"
  const [selectedJob, setSelectedJob] = useState(null);
  
  // New job form state
  const [newJobForm, setNewJobForm] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    time: "",
    hours_required: 2,
    hourly_rate: cleaner?.hourly_rate || 15,
    services: []
  });

  useEffect(() => {
    if (show && user) {
      // Fetch employer's open jobs
      dispatch(fetchEmployerJobs({ status: "open" }));
    }
  }, [show, user, dispatch]);

  const handleAssignToExisting = async () => {
    if (!selectedJob) {
      toast.error("Please select a job");
      return;
    }

    try {
      await dispatch(assignCleanerToJob({
        jobId: selectedJob,
        cleanerId: cleaner.id,
        message: `You have been assigned to job #${selectedJob}. Please review and confirm.`
      })).unwrap();
      
      toast.success("Cleaner assigned successfully! They will be notified.");
      onClose();
      
      // Trigger notification to cleaner
      // This would ideally use WebSockets or push notifications
      sendNotificationToCleaner(cleaner.id, selectedJob);
      
    } catch (error) {
      toast.error("Failed to assign cleaner: " + error.message);
    }
  };

  const handleCreateAndAssign = async () => {
    // Validate form
    if (!newJobForm.title || !newJobForm.location || !newJobForm.date) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const jobData = {
        ...newJobForm,
        assigned_cleaner: cleaner.id,
        status: "pending_confirmation",
        employer: user.id
      };

      const result = await dispatch(createJobAndAssign(jobData)).unwrap();
      
      toast.success("Job created and cleaner assigned! Awaiting confirmation.");
      onClose();
      
      // Initialize chat channel
      initializeChatChannel(result.job_id, user.id, cleaner.id);
      
      // Send notification
      sendNotificationToCleaner(cleaner.id, result.job_id);
      
    } catch (error) {
      toast.error("Failed to create job: " + error.message);
    }
  };

  // Helper to send notifications (would integrate with your notification system)
  const sendNotificationToCleaner = async (cleanerId, jobId) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        },
        body: JSON.stringify({
          recipient: cleanerId,
          type: "job_assignment",
          title: "New Job Assignment",
          message: `You have been assigned to a new job. Please review and confirm.`,
          job_id: jobId,
          action_required: true
        })
      });
    } catch (error) {
      console.error("Failed to send notification:", error);
    }
  };

  // Helper to initialize chat channel
  const initializeChatChannel = async (jobId, employerId, cleanerId) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/channels/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        },
        body: JSON.stringify({
          job_id: jobId,
          participants: [employerId, cleanerId],
          type: "job_discussion"
        })
      });
    } catch (error) {
      console.error("Failed to initialize chat:", error);
    }
  };

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Book {cleaner?.name || "Cleaner"}</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {/* Tab Navigation */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "existing" ? "active" : ""}`}
              onClick={() => setActiveTab("existing")}
            >
              Assign to Existing Job
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "new" ? "active" : ""}`}
              onClick={() => setActiveTab("new")}
            >
              Create New Job
            </button>
          </li>
        </ul>

        {/* Tab Content */}
        {activeTab === "existing" ? (
          <div className="existing-jobs-tab">
            <h5>Select a job to assign {cleaner?.name} to:</h5>
            
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : jobs.length === 0 ? (
              <div className="alert alert-info">
                You don't have any open jobs. Create a new one instead.
              </div>
            ) : (
              <div className="jobs-list" style={{ maxHeight: "400px", overflowY: "auto" }}>
                {jobs.map((job) => (
                  <div 
                    key={job.id}
                    className={`job-card p-3 mb-3 border rounded cursor-pointer ${
                      selectedJob === job.id ? "border-primary bg-light" : ""
                    }`}
                    onClick={() => setSelectedJob(job.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="job"
                        checked={selectedJob === job.id}
                        onChange={() => setSelectedJob(job.id)}
                      />
                      <label className="form-check-label w-100">
                        <h6>{job.title}</h6>
                        <p className="mb-1 text-muted">{job.location}</p>
                        <p className="mb-0">
                          <small>
                            {new Date(job.date).toLocaleDateString()} at {job.time}
                            {" • "}
                            £{job.hourly_rate}/hr for {job.hours_required} hours
                          </small>
                        </p>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-4">
              <button
                className="theme-btn btn-style-one w-100"
                onClick={handleAssignToExisting}
                disabled={!selectedJob || loading}
              >
                Assign to Selected Job
              </button>
            </div>
          </div>
        ) : (
          <div className="new-job-tab">
            <h5>Create a new job for {cleaner?.name}:</h5>
            
            <form className="default-form">
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label>Job Title *</label>
                    <input
                      type="text"
                      placeholder="e.g., Deep Clean 2-bed apartment"
                      value={newJobForm.title}
                      onChange={(e) => setNewJobForm({...newJobForm, title: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="col-lg-12">
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      placeholder="Describe the cleaning requirements..."
                      rows="3"
                      value={newJobForm.description}
                      onChange={(e) => setNewJobForm({...newJobForm, description: e.target.value})}
                    />
                  </div>
                </div>

                <div className="col-lg-12">
                  <div className="form-group">
                    <label>Location *</label>
                    <input
                      type="text"
                      placeholder="Full address"
                      value={newJobForm.location}
                      onChange={(e) => setNewJobForm({...newJobForm, location: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="form-group">
                    <label>Date *</label>
                    <input
                      type="date"
                      value={newJobForm.date}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setNewJobForm({...newJobForm, date: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="form-group">
                    <label>Time *</label>
                    <input
                      type="time"
                      value={newJobForm.time}
                      onChange={(e) => setNewJobForm({...newJobForm, time: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="form-group">
                    <label>Hours Required</label>
                    <input
                      type="number"
                      min="1"
                      max="8"
                      value={newJobForm.hours_required}
                      onChange={(e) => setNewJobForm({...newJobForm, hours_required: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="form-group">
                    <label>Hourly Rate (£)</label>
                    <input
                      type="number"
                      min="10"
                      value={newJobForm.hourly_rate}
                      onChange={(e) => setNewJobForm({...newJobForm, hourly_rate: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="col-lg-12">
                  <div className="form-group">
                    <label>Services Needed</label>
                    <div className="services-checkboxes">
                      {cleaner?.services?.map((service, idx) => (
                        <div key={idx} className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`service-${idx}`}
                            value={service}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewJobForm({
                                  ...newJobForm,
                                  services: [...newJobForm.services, service]
                                });
                              } else {
                                setNewJobForm({
                                  ...newJobForm,
                                  services: newJobForm.services.filter(s => s !== service)
                                });
                              }
                            }}
                          />
                          <label className="form-check-label" htmlFor={`service-${idx}`}>
                            {service}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="col-lg-12">
                  <div className="alert alert-info">
                    <i className="la la-info-circle"></i>
                    <strong>Total Cost Estimate:</strong> £{(newJobForm.hourly_rate * newJobForm.hours_required).toFixed(2)}
                    <br/>
                    <small>The cleaner will review and confirm this booking. Payment will be processed after job completion.</small>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="theme-btn btn-style-one w-100"
                onClick={handleCreateAndAssign}
              >
                Create Job & Send to Cleaner
              </button>
            </form>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default BookingModal;