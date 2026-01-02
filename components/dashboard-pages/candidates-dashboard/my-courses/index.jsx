"use client";

import MobileMenu from "../../../header/MobileMenu";
import DashboardCandidatesSidebar from "../../../header/DashboardCandidatesSidebar";
import BreadCrumb from "../../BreadCrumb";
import CopyrightFooter from "../../CopyrightFooter";
import DashboardCandidatesHeader from "../../../header/DashboardCandidatesHeader";
import MenuToggler from "../../MenuToggler";
import LoginPopup from "../../../common/form/login/LoginPopup";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { learningService } from "@/services/learningService";

const MyCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await learningService.getMyLearning();
        setEnrolledCourses(data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="page-wrapper dashboard">
      <span className="header-span"></span>
      {/* <!-- Header Span for hight --> */}

      <LoginPopup />
      {/* End Login Popup Modal */}

      <DashboardCandidatesHeader />
      {/* End Header */}

      <MobileMenu />
      {/* End MobileMenu */}

      <DashboardCandidatesSidebar />
      {/* End Sidebar */}

      {/* <!-- Dashboard --> */}
      <section className="user-dashboard">
        <div className="dashboard-outer">
          <BreadCrumb title="My Courses!" />
          {/* breadCrumb */}

          <div className="menu-outer">
            <MenuToggler />
          </div>
          {/* Collapsible sidebar button */}

          <div className="row">
            <div className="col-lg-12">
              <div className="ls-widget">
                <div className="tabs-box">
                  <div className="widget-title">
                    <h4>My Enrolled Courses</h4>
                  </div>
                  {/* End widget-title */}

                  <div className="widget-content">
                    {loading ? (
                      <div className="text-center">Loading courses...</div>
                    ) : enrolledCourses.length === 0 ? (
                      <div className="text-center">
                        <p>You haven't enrolled in any courses yet.</p>
                        <Link href="/courses" className="theme-btn btn-style-one">
                          Browse Courses
                        </Link>
                      </div>
                    ) : (
                      <div className="row">
                        {enrolledCourses.map((enrollment) => (
                          <div
                            className="col-lg-6 col-md-12 col-sm-12 mb-4"
                            key={enrollment.id}
                          >
                            <div
                              className="course-block"
                              style={{
                                border: "1px solid #eee",
                                borderRadius: "16px",
                                overflow: "hidden",
                                transition: "all 0.3s ease",
                                background: "#fff",
                                boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
                              }}
                            >
                              <div className="inner-box">
                                <div
                                  className="image-box"
                                  style={{ position: "relative", height: "220px" }}
                                >
                                  <Image
                                    src={
                                      enrollment.course.thumbnail ||
                                      "/images/resource/course-1.jpg"
                                    }
                                    alt={enrollment.course.title}
                                    fill
                                    style={{ objectFit: "cover" }}
                                  />
                                  <div
                                    className="overlay-box"
                                    style={{
                                      position: "absolute",
                                      top: 0,
                                      left: 0,
                                      width: "100%",
                                      height: "100%",
                                      background:
                                        "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                                      display: "flex",
                                      alignItems: "flex-end",
                                      padding: "20px",
                                    }}
                                  >
                                    <div style={{ width: "100%" }}>
                                      <div className="d-flex justify-content-between align-items-center text-white mb-2">
                                        <span
                                          style={{
                                            fontSize: "12px",
                                            background: "rgba(255,255,255,0.2)",
                                            padding: "4px 10px",
                                            borderRadius: "20px",
                                            backdropFilter: "blur(5px)",
                                          }}
                                        >
                                          {enrollment.course.level}
                                        </span>
                                        {/* <span style={{ fontSize: '12px' }}><i className="las la-clock"></i> {course.duration}</span> */}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className="content-box"
                                  style={{ padding: "25px" }}
                                >
                                  <h4
                                    style={{
                                      fontSize: "20px",
                                      fontWeight: "700",
                                      marginBottom: "15px",
                                      lineHeight: "1.4",
                                    }}
                                  >
                                    <Link
                                      href={`/my-courses/${enrollment.course.slug}`}
                                      style={{
                                        color: "#1a1a1a",
                                        textDecoration: "none",
                                      }}
                                    >
                                      {enrollment.course.title}
                                    </Link>
                                  </h4>

                                  <div
                                    className="progress-box"
                                    style={{ marginBottom: "20px" }}
                                  >
                                    <div className="d-flex justify-content-between mb-2">
                                      <span
                                        style={{
                                          fontSize: "13px",
                                          fontWeight: "600",
                                          color: "#666",
                                        }}
                                      >
                                        Progress
                                      </span>
                                      <span
                                        style={{
                                          fontSize: "13px",
                                          color: "#1967d2",
                                          fontWeight: "700",
                                        }}
                                      >
                                        {Math.round(enrollment.progress_percent)}%
                                      </span>
                                    </div>
                                    <div
                                      className="progress"
                                      style={{
                                        height: "8px",
                                        borderRadius: "4px",
                                        background: "#f0f0f0",
                                      }}
                                    >
                                      <div
                                        className="progress-bar"
                                        role="progressbar"
                                        style={{
                                          width: `${enrollment.progress_percent}%`,
                                          background: "#1967d2",
                                          borderRadius: "4px",
                                        }}
                                        aria-valuenow={enrollment.progress_percent}
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                      ></div>
                                    </div>
                                  </div>

                                  <div className="d-flex justify-content-between align-items-center">
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                      }}
                                    >
                                      {/* <div style={{ width: '30px', height: '30px', background: '#eee', borderRadius: '50%', overflow: 'hidden' }}>
                                            <Image src="/images/resource/candidate-1.png" width={30} height={30} alt="Instructor" />
                                        </div>
                                        <span style={{ fontSize: '13px', color: '#666' }}>{course.instructor}</span> */}
                                    </div>
                                    <Link
                                      href={`/my-courses/${enrollment.course.slug}`}
                                      className="theme-btn btn-style-one"
                                      style={{
                                        padding: "10px 25px",
                                        fontSize: "14px",
                                        borderRadius: "50px",
                                      }}
                                    >
                                      Continue
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* End .row */}
        </div>
        {/* End dashboard-outer */}
      </section>
      {/* <!-- End Dashboard --> */}

      <CopyrightFooter />
      {/* <!-- End Copyright --> */}
    </div>
    // End page-wrapper
  );
};

export default MyCourses;
