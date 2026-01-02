"use client";

import Link from "next/link";
import { useCourse } from "./CourseContext";

const CourseWelcome = () => {
  const { course, loading } = useCourse();

  if (loading) return <div>Loading...</div>;
  if (!course) return <div>Course not found</div>;

  // Find the first lesson
  const firstModule = course.modules?.[0];
  const firstLesson = firstModule?.lessons?.[0];

  return (
    <div
      style={{
        padding: "50px",
        maxWidth: "800px",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <div style={{ marginBottom: "30px" }}>
        <i
          className="las la-trophy"
          style={{ fontSize: "64px", color: "#f7c32e" }}
        ></i>
      </div>
      <h1
        style={{ fontSize: "32px", fontWeight: "700", marginBottom: "20px" }}
      >
        Welcome to {course.title}
      </h1>
      <p
        style={{
          fontSize: "18px",
          color: "#666",
          marginBottom: "40px",
          lineHeight: "1.6",
        }}
      >
        You're about to start your journey to mastering professional cleaning.
        Get ready to learn valuable skills that will boost your career.
      </p>

      <div
        className="card"
        style={{
          padding: "30px",
          borderRadius: "16px",
          border: "none",
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          textAlign: "left",
          marginBottom: "40px",
        }}
      >
        <h3
          style={{ fontSize: "20px", fontWeight: "600", marginBottom: "20px" }}
        >
          Course Overview
        </h3>
        <div className="row">
          <div className="col-md-4">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  background: "#eef2f6",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#1967d2",
                }}
              >
                <i className="las la-video"></i>
              </div>
              <div>
                <div style={{ fontSize: "12px", color: "#666" }}>Lectures</div>
                <div style={{ fontWeight: "600" }}>
                  {course.modules?.reduce(
                    (acc, m) => acc + (m.lessons?.length || 0),
                    0
                  ) || 0}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  background: "#eef2f6",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#1967d2",
                }}
              >
                <i className="las la-clock"></i>
              </div>
              <div>
                <div style={{ fontSize: "12px", color: "#666" }}>Duration</div>
                <div style={{ fontWeight: "600" }}>
                  {course.duration || "Self-paced"}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  background: "#eef2f6",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#1967d2",
                }}
              >
                <i className="las la-certificate"></i>
              </div>
              <div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  Certificate
                </div>
                <div style={{ fontWeight: "600" }}>Yes</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {firstLesson && (
        <Link
          href={`/my-courses/${course.slug}/lessons/${firstLesson.id}`}
          className="theme-btn btn-style-one"
          style={{ padding: "15px 40px", fontSize: "18px" }}
        >
          Start First Lesson <i className="las la-arrow-right ml-2"></i>
        </Link>
      )}
    </div>
  );
};

export default CourseWelcome;

