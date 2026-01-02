"use client";

import Link from "next/link";
import { useState } from "react";
import { CourseProvider, useCourse } from "./CourseContext";
import { usePathname } from "next/navigation";

const CourseLayoutInner = ({ children }) => {
  const { course, enrollment, loading } = useCourse();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const pathname = usePathname();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!course) {
    return <div className="p-5 text-center">Course not found</div>;
  }

  return (
    <div
      className={`course-player-layout ${darkMode ? "dark-mode" : ""}`}
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: darkMode ? "#121212" : "#f5f7fc",
        color: darkMode ? "#fff" : "#333",
      }}
    >
      
      {/* Sidebar Toggle Button (Mobile/Collapsed) */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            zIndex: 100,
            background: "#1967d2",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          }}
        >
          <i className="las la-bars"></i>
        </button>
      )}

      {/* Sidebar */}
      <aside
        className="course-sidebar"
        style={{
          width: isSidebarOpen ? "350px" : "0",
          background: darkMode ? "#1e1e1e" : "#fff",
          borderRight: darkMode ? "1px solid #333" : "1px solid #eee",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          transition: "width 0.3s ease",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          className="sidebar-header"
          style={{
            padding: "20px",
            borderBottom: darkMode ? "1px solid #333" : "1px solid #eee",
            background: darkMode ? "#1e1e1e" : "#fff",
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Link
              href="/candidates-dashboard/my-courses"
              style={{
                fontSize: "13px",
                color: darkMode ? "#aaa" : "#666",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                textDecoration: "none",
              }}
            >
              <i className="las la-arrow-left"></i> Dashboard
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              style={{
                background: "none",
                border: "none",
                color: darkMode ? "#aaa" : "#666",
              }}
            >
              <i className="las la-times"></i>
            </button>
          </div>

          <h5
            style={{
              fontSize: "16px",
              fontWeight: "700",
              lineHeight: "1.4",
              marginBottom: "15px",
              color: darkMode ? "#fff" : "#000",
            }}
          >
            {course.title}
          </h5>

          <div className="progress-container">
            <div
              className="d-flex justify-content-between mb-1"
              style={{ fontSize: "12px", color: darkMode ? "#aaa" : "#666" }}
            >
              <span>Course Progress</span>
              <span>{enrollment ? Math.round(enrollment.progress_percent) : 0}%</span>
            </div>
            <div
              className="progress"
              style={{
                height: "6px",
                background: darkMode ? "#333" : "#e9ecef",
              }}
            >
              <div
                className="progress-bar"
                role="progressbar"
                style={{
                  width: `${enrollment ? enrollment.progress_percent : 0}%`,
                  background: "#1967d2",
                  borderRadius: "3px",
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="sidebar-content" style={{ flex: 1, overflowY: "auto" }}>
          <div className="accordion" id="coursePlayerAccordion">
            {course.modules &&
              course.modules.map((module, index) => (
                <div
                  className="accordion-item"
                  key={index}
                  style={{
                    border: "none",
                    borderBottom: darkMode ? "1px solid #333" : "1px solid #eee",
                    background: "transparent",
                  }}
                >
                  <h2 className="accordion-header" id={`heading${index}`}>
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#collapse${index}`}
                      aria-expanded="true"
                      aria-controls={`collapse${index}`}
                      style={{
                        background: darkMode ? "#252525" : "#f9f9f9",
                        color: darkMode ? "#fff" : "#333",
                        fontSize: "14px",
                        fontWeight: "600",
                        padding: "15px 20px",
                        boxShadow: "none",
                        border: "none",
                      }}
                    >
                      {module.title}
                    </button>
                  </h2>
                  <div
                    id={`collapse${index}`}
                    className="accordion-collapse collapse show"
                    aria-labelledby={`heading${index}`}
                  >
                    <div className="accordion-body" style={{ padding: 0 }}>
                      {module.lessons.map((lesson, lIndex) => {
                        const isActive = pathname.includes(`/lessons/${lesson.id}`);
                        return (
                          <Link
                            key={lesson.id}
                            href={`/my-courses/${course.slug}/lessons/${lesson.id}`}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              padding: "12px 20px 12px 30px",
                              borderLeft: isActive
                                ? "3px solid #1967d2"
                                : "3px solid transparent",
                              background: isActive
                                ? darkMode
                                  ? "#333"
                                  : "#eef2f6"
                                : "transparent",
                              color: isActive
                                ? "#1967d2"
                                : darkMode
                                ? "#ccc"
                                : "#555",
                              textDecoration: "none",
                              fontSize: "13px",
                              transition: "all 0.2s ease",
                            }}
                          >
                            <i
                              className={`las ${
                                lesson.content_type === "VIDEO"
                                  ? "la-play-circle"
                                  : lesson.content_type === "QUIZ"
                                  ? "la-question-circle"
                                  : "la-file-alt"
                              }`}
                              style={{
                                marginRight: "10px",
                                fontSize: "16px",
                                opacity: 0.7,
                              }}
                            ></i>
                            <span style={{ flex: 1 }}>{lesson.title}</span>
                            {lesson.is_completed && (
                              <i
                                className="las la-check-circle"
                                style={{ color: "#28a745", fontSize: "16px" }}
                              ></i>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        
        {/* Sidebar Footer */}
        <div className="sidebar-footer" style={{ padding: '15px', borderTop: darkMode ? '1px solid #333' : '1px solid #eee', background: darkMode ? '#1e1e1e' : '#fff' }}>
            <button 
                onClick={() => setDarkMode(!darkMode)}
                style={{ width: '100%', padding: '10px', border: darkMode ? '1px solid #444' : '1px solid #ddd', borderRadius: '6px', background: 'transparent', color: darkMode ? '#fff' : '#333', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
                {darkMode ? <><i className="las la-sun"></i> Light Mode</> : <><i className="las la-moon"></i> Dark Mode</>}
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="course-content" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {children}
      </main>
    </div>
  );
};

export default function CourseLayout({ children, params }) {
  return (
    <CourseProvider slug={params.slug}>
      <CourseLayoutInner>{children}</CourseLayoutInner>
    </CourseProvider>
  );
}
