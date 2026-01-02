"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { learningService } from "@/services/learningService";
import { toast } from "react-toastify";
import LoginPopup from "@/components/common/form/login/LoginPopup";
import FooterDefault from "@/components/footer/common-footer";
import DefaulHeader from "@/components/header/DefaulHeader2";
import MobileMenu from "@/components/header/MobileMenu";

const CourseDetails = ({ params }) => {
  const id = params.id; // This is likely the slug or ID depending on the link
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        // Try to fetch by slug/id
        const data = await learningService.getCourseBySlug(id);
        setCourse(data);
      } catch (err) {
        console.error("Error fetching course details:", err);
        toast.error("Failed to load course details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id]);

  const handleEnroll = async () => {
    if (!course) return;

    try {
      setEnrolling(true);
      // Check if user is logged in (simple check via localStorage token presence)
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.info("Please login to enroll in this course.");
        router.push("/login");
        return;
      }

      await learningService.enrollInCourse(course.slug || course.id);
      toast.success("Successfully enrolled! Redirecting to your dashboard...");
      
      // Redirect to My Learning or the course player
      setTimeout(() => {
        router.push(`/my-courses/${course.slug}`);
      }, 1500);

    } catch (err) {
      console.error("Enrollment error:", err);
      if (err.response && err.response.status === 400) {
        // Likely already enrolled
        toast.info("You are already enrolled in this course.");
        router.push(`/my-courses/${course.slug}`);
      } else {
        toast.error("Failed to enroll. Please try again.");
      }
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-5">
        <h3>Course not found</h3>
        <Link href="/courses" className="theme-btn btn-style-one mt-3">Back to Courses</Link>
      </div>
    );
  }

  return (
    <>
      {/* Header & Menu */}
      <LoginPopup />
      <DefaulHeader />
      <MobileMenu />

      {/* Hero Section - MasterClass Style */}
      <section className="course-hero-section" style={{ position: 'relative', background: '#1a1a1a', color: '#fff', padding: '80px 0 100px', overflow: 'hidden' }}>
        {/* Background Image with Overlay */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, opacity: 0.3 }}>
             <Image 
                src={course.thumbnail || course.image || "/images/resource/course-1.jpg"} 
                alt={course.title} 
                fill
                style={{ objectFit: 'cover', filter: 'blur(10px)' }}
            />
        </div>
        
        <div className="auto-container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="row">
            <div className="col-lg-8">
                <div className="badge" style={{ background: '#f7c32e', color: '#000', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold', marginBottom: '20px', textTransform: 'uppercase', fontSize: '12px' }}>
                    {course.level || "All Levels"}
                </div>
                <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '20px', lineHeight: '1.2' }}>{course.title}</h1>
                <p style={{ fontSize: '20px', lineHeight: '1.6', marginBottom: '30px', opacity: 0.9, maxWidth: '700px' }}>
                  {course.description ? (course.description.length > 150 ? course.description.substring(0, 150) + '...' : course.description) : course.subtitle}
                </p>
                
                <div className="course-meta" style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', marginBottom: '40px' }}>
                    <div className="rating" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#f7c32e', fontWeight: 'bold' }}>
                        <span>{course.rating || 0}</span>
                        <i className="las la-star"></i>
                        <span style={{ color: '#ccc', fontWeight: 'normal', marginLeft: '5px' }}>({course.total_reviews || course.reviews || 0} reviews)</span>
                    </div>
                    <div className="instructor" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ opacity: 0.7 }}>Created by</span>
                        <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>{course.instructor}</span>
                    </div>
                    <div className="last-updated" style={{ display: 'flex', alignItems: 'center', gap: '5px', opacity: 0.7 }}>
                        <i className="las la-exclamation-circle"></i>
                        <span>Last updated {new Date(course.updated_at || Date.now()).toLocaleDateString()}</span>
                    </div>
                </div>

                <div className="hero-btns" style={{ display: 'flex', gap: '15px' }}>
                    <button 
                      onClick={handleEnroll} 
                      disabled={enrolling}
                      className="theme-btn btn-style-one" 
                      style={{ padding: '15px 40px', fontSize: '16px', borderRadius: '50px', border: 'none', cursor: 'pointer' }}
                    >
                      {enrolling ? "Enrolling..." : "Start Learning Now"}
                    </button>
                    <button style={{ background: 'transparent', border: '2px solid rgba(255,255,255,0.3)', color: '#fff', padding: '15px 30px', borderRadius: '50px', fontWeight: '600' }}>Wishlist <i className="las la-heart ml-2"></i></button>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="course-details-section" style={{ padding: "80px 0", background: '#f8f9fa' }}>
        <div className="auto-container">
          <div className="row">
            {/* Left Column */}
            <div className="col-lg-8 col-md-12">
              
              {/* What you'll learn */}
              <div className="learn-box" style={{ background: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', marginBottom: '40px', border: '1px solid #eee' }}>
                <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '30px' }}>What you'll learn</h3>
                <div className="row">
                    {course.learning_outcomes && course.learning_outcomes.length > 0 ? (
                        <>
                            <div className="col-md-6">
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    {course.learning_outcomes.slice(0, Math.ceil(course.learning_outcomes.length / 2)).map((item, i) => (
                                        <li key={i} style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}><i className="las la-check" style={{ color: '#1967d2', marginTop: '5px' }}></i> <span>{item}</span></li>
                                    ))}
                                </ul>
                            </div>
                            <div className="col-md-6">
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    {course.learning_outcomes.slice(Math.ceil(course.learning_outcomes.length / 2)).map((item, i) => (
                                        <li key={i} style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}><i className="las la-check" style={{ color: '#1967d2', marginTop: '5px' }}></i> <span>{item}</span></li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    ) : (
                        <p>No learning outcomes listed.</p>
                    )}
                </div>
              </div>

              {/* Course Content Accordion */}
              <div className="course-content-box" id="course-content" style={{ marginBottom: '50px' }}>
                <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px' }}>Course Content</h3>
                <div className="d-flex justify-content-between align-items-center mb-3" style={{ fontSize: '14px', color: '#666' }}>
                    <span>{(course.modules || course.content || []).length} sections • {course.lectures || 0} lectures • {course.duration} total length</span>
                    <button style={{ border: 'none', background: 'none', color: '#1967d2', fontWeight: '600' }}>Expand all sections</button>
                </div>

                <div className="accordion" id="courseAccordion">
                  {(course.modules || course.content || []).map((module, index) => (
                    <div className="accordion-item" key={module.id || index} style={{ marginBottom: '15px', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
                      <h2 className="accordion-header" id={`heading${index}`}>
                        <button 
                          className="accordion-button collapsed" 
                          type="button" 
                          data-bs-toggle="collapse" 
                          data-bs-target={`#collapse${index}`} 
                          aria-expanded="false" 
                          aria-controls={`collapse${index}`}
                          style={{ width: '100%', padding: '20px', background: '#fff', border: 'none', textAlign: 'left', fontWeight: '600', fontSize: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <i className="las la-angle-down"></i>
                            {module.title}
                          </span>
                        </button>
                      </h2>
                      <div 
                        id={`collapse${index}`} 
                        className="accordion-collapse collapse" 
                        aria-labelledby={`heading${index}`} 
                        data-bs-parent="#courseAccordion"
                      >
                        <div className="accordion-body" style={{ padding: '0 20px 20px', background: '#fff' }}>
                          {module.objective && <p style={{ marginBottom: '20px', fontSize: '14px', color: '#666', paddingLeft: '25px' }}>{module.objective}</p>}
                          <div className="topics-list">
                            {(module.lessons || module.topics || []).map((topic, tIndex) => (
                              <div key={topic.id || tIndex} className="topic-item" style={{ padding: '12px 0', borderTop: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '15px', paddingLeft: '25px' }}>
                                <i className={`las ${topic.type === 'video' ? 'la-play-circle' : 'la-file-alt'}`} style={{ color: '#1967d2', fontSize: '20px' }}></i>
                                <div>
                                    <h5 style={{ fontSize: '15px', fontWeight: '500', margin: 0 }}>{topic.title}</h5>
                                    {topic.duration && <span style={{ fontSize: '12px', color: '#999' }}>{topic.duration}</span>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="description-box" style={{ marginBottom: '50px' }}>
                <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px' }}>Description</h3>
                <div style={{ fontSize: '16px', lineHeight: '1.8', color: '#444' }}>
                    <p>{course.description || course.subtitle}</p>
                </div>
              </div>

              {/* Instructor */}
              <div className="instructor-box" style={{ background: '#fff', padding: '40px', borderRadius: '16px', border: '1px solid #eee' }}>
                <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '30px' }}>Instructor</h3>
                <div className="d-flex gap-4 align-items-start">
                    <div style={{ width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: '#eee' }}>
                        <Image 
                            src={course.instructor_image || "/images/resource/candidate-1.png"} 
                            alt={course.instructor} 
                            width={100} 
                            height={100} 
                            style={{ objectFit: 'cover' }} 
                        />
                    </div>
                    <div>
                        <h4 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '5px' }}>{course.instructor || "Course Instructor"}</h4>
                        <p style={{ color: '#666', marginBottom: '15px' }}>{course.instructor_title || "Professional Training Provider"}</p>
                        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', fontSize: '14px' }}>
                            <span><i className="las la-star" style={{ color: '#f7c32e' }}></i> {course.instructor_rating || "5.0"} Rating</span>
                            <span><i className="las la-user-friends" style={{ color: '#1967d2' }}></i> {course.instructor_students || "100+"} Students</span>
                            <span><i className="las la-play-circle" style={{ color: '#1967d2' }}></i> {course.instructor_courses_count || "5"} Courses</span>
                        </div>
                        <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#555' }}>
                            {course.instructor_bio || `${course.instructor || "The instructor"} is a professional training provider dedicated to helping students master new skills.`}
                        </p>
                    </div>
                </div>
              </div>

            </div>

            {/* Right Sidebar - Sticky */}
            <div className="col-lg-4 col-md-12">
              <div className="course-sidebar-wrapper" style={{ position: 'sticky', top: '100px' }}>
                <div className="course-sidebar" style={{ background: '#fff', padding: '5px', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', border: '1px solid #eee', overflow: 'hidden' }}>
                  
                  {/* Video Preview / Course Image */}
                  <div className="video-box" style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px', cursor: course.preview_video ? 'pointer' : 'default' }}>
                    <Image 
                      src={course.thumbnail || course.image || "/images/resource/course-1.jpg"} 
                      alt={course.title} 
                      width={400} 
                      height={250} 
                      style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                    {course.preview_video && (
                        <>
                            <div style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ width: '60px', height: '60px', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>
                                    <i className="las la-play" style={{ fontSize: '24px', color: '#1967d2', marginLeft: '4px' }}></i>
                                </div>
                            </div>
                            <div style={{ position: 'absolute', bottom: '15px', width: '100%', textAlign: 'center', color: '#fff', fontWeight: '600', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Preview this course</div>
                        </>
                    )}
                  </div>

                  <div className="content-box" style={{ padding: '0 25px 25px' }}>
                    <div className="price-box" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                        <div className="price" style={{ fontSize: '32px', fontWeight: '800', color: '#1a1a1a' }}>
                            {!course.price || course.price === "Free" || Number(course.price) === 0 ? "Free" : `$${course.price}`}
                        </div>
                        {Number(course.price) > 0 && course.originalPrice && (
                            <div className="original-price" style={{ fontSize: '18px', textDecoration: 'line-through', color: '#999' }}>
                                {course.originalPrice}
                            </div>
                        )}
                        {Number(course.price) > 0 && course.originalPrice && (course.discount_percentage > 0 || course.discount) && (
                            <div className="discount" style={{ fontSize: '14px', color: '#d32f2f', fontWeight: '600' }}>
                                {course.discount_percentage || course.discount}% OFF
                            </div>
                        )}
                    </div>

                    <div className="btn-box d-flex flex-column gap-3 mb-4">
                      <button 
                        onClick={handleEnroll}
                        disabled={enrolling}
                        className="theme-btn btn-style-one" 
                        style={{ display: 'block', textAlign: 'center', padding: '15px', borderRadius: '8px', fontSize: '16px', fontWeight: '700', width: '100%', border: 'none' }}
                      >
                        {enrolling ? "Enrolling..." : "Enroll Now"}
                      </button>
                    </div>

                    {Number(course.price) > 0 && (
                        <div style={{ textAlign: 'center', fontSize: '13px', color: '#666', marginBottom: '25px' }}>{course.guarantee_text || "30-Day Money-Back Guarantee"}</div>
                    )}

                    <div className="includes-box">
                        <h5 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '15px' }}>This course includes:</h5>
                        <ul className="course-info-list" style={{ listStyle: 'none', padding: 0, marginBottom: '0' }}>
                        
                        {course.level && (
                            <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#444' }}>
                                <i className="las la-layer-group" style={{ width: '20px' }}></i>
                                <span>{course.level} Level</span>
                            </li>
                        )}

                        {course.lectures && (
                            <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#444' }}>
                                <i className="las la-file-video" style={{ width: '20px' }}></i>
                                <span>{course.lectures}</span>
                            </li>
                        )}

                        <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#444' }}>
                            <i className={`las ${course.type === 'video' ? 'la-video' : 'la-book-open'}`} style={{ width: '20px' }}></i>
                            <span>{course.duration || "Self-paced"} {course.type === 'video' ? "on-demand video" : "learning content"}</span>
                        </li>
                        {(course.articles_count > 0) && (
                            <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#444' }}>
                                <i className="las la-file-alt" style={{ width: '20px' }}></i>
                                <span>{course.articles_count} {course.articles_label || "Articles and resources"}</span>
                            </li>
                        )}

                        <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#444' }}>
                            <i className="las la-infinity" style={{ width: '20px' }}></i>
                            <span>Full lifetime access</span>
                        </li>

                        <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#444' }}>
                            <i className="las la-laptop" style={{ width: '20px' }}></i>
                            <span>Access on {course.access_devices ? course.access_devices.join(", ") : "mobile, desktop, and TV"}</span>
                        </li>
                        {course.has_certificate && (
                            <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#444' }}>
                                <i className="las la-certificate" style={{ width: '20px' }}></i>
                                <span>{course.certificate_label || "Certificate of completion"}</span>
                            </li>
                        )}
                        </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <FooterDefault />
    </>
  );
};

export default CourseDetails;
