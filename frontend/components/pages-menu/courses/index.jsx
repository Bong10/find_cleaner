"use client";

import { useState } from "react";
import LoginPopup from "@/components/common/form/login/LoginPopup";
import MobileMenu from "@/components/header/MobileMenu";
import DefaulHeader from "@/components/header/DefaulHeader2";
import Breadcrumb from "@/components/common/Breadcrumb";
import CoursesList from "./CoursesList";
import FooterDefault from "@/components/footer/common-footer";

const index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");

  return (
    <>
      <LoginPopup />
      {/* End Login Popup Modal */}

      <DefaulHeader />
      {/* <!--End Main Header --> */}

      <MobileMenu />
      {/* End MobileMenu */}

      <Breadcrumb title="Training Courses" meta="Courses" />
      {/* <!--End Breadcrumb --> */}

      <section className="courses-section" style={{ padding: "50px 0" }}>
        <div className="auto-container">
          <div className="sec-title text-center" style={{ marginBottom: "40px" }}>
            <h2>Professional Cleaning Courses</h2>
            <div className="text">
              Enhance your skills and grow your cleaning career with our expert-led training programs
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="search-filter-section" style={{ marginBottom: "40px" }}>
            <div className="row align-items-center">
              <div className="col-lg-8 col-md-7 col-sm-12">
                <div className="search-box" style={{ position: "relative" }}>
                  <input
                    type="text"
                    placeholder="Search for courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "15px 50px 15px 20px",
                      fontSize: "16px",
                      border: "2px solid #d1d7dc",
                      borderRadius: "8px",
                      outline: "none",
                      transition: "all 0.3s ease"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#2aa389"}
                    onBlur={(e) => e.target.style.borderColor = "#d1d7dc"}
                  />
                  <i 
                    className="la la-search" 
                    style={{
                      position: "absolute",
                      right: "20px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "20px",
                      color: "#6a6f73"
                    }}
                  ></i>
                </div>
              </div>

              <div className="col-lg-4 col-md-5 col-sm-12">
                <div className="filter-box">
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "15px 20px",
                      fontSize: "16px",
                      border: "2px solid #d1d7dc",
                      borderRadius: "8px",
                      outline: "none",
                      cursor: "pointer",
                      backgroundColor: "white",
                      transition: "all 0.3s ease"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#2aa389"}
                    onBlur={(e) => e.target.style.borderColor = "#d1d7dc"}
                  >
                    <option value="All Levels">All Levels</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <CoursesList searchTerm={searchTerm} selectedLevel={selectedLevel} />
        </div>
      </section>
      {/* <!-- End Courses Section --> */}

      <FooterDefault />
      {/* <!-- End Main Footer --> */}

      <style jsx>{`
        @media (max-width: 767px) {
          .search-box {
            margin-bottom: 15px;
          }
        }
      `}</style>
    </>
  );
};

export default index;
