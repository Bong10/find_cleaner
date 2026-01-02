"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { learningService } from "@/services/learningService";

const CoursesList = ({ searchTerm = "", selectedLevel = "All Levels" }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await learningService.getAllCourses();
        setCourses(data);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filter courses based on search term and level
  const filteredCourses = courses.filter(course => {
    const matchesSearch = searchTerm === "" || 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (course.instructor && course.instructor.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLevel = selectedLevel === "All Levels" || course.level === selectedLevel;
    
    return matchesSearch && matchesLevel;
  });

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-5 text-danger">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      {filteredCourses.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          background: '#f7f9fa',
          borderRadius: '12px'
        }}>
          <i className="la la-search" style={{ fontSize: '80px', color: '#d1d7dc', marginBottom: '20px' }}></i>
          <h3 style={{ fontSize: '24px', color: '#1c1d1f', marginBottom: '10px' }}>No courses found</h3>
          <p style={{ fontSize: '16px', color: '#6a6f73' }}>
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      ) : (
        <>
          <div className="results-count" style={{ 
            marginBottom: '20px', 
            fontSize: '16px', 
            color: '#1c1d1f',
            fontWeight: '600'
          }}>
            Showing {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'}
          </div>
          
          <div className="row" style={{ rowGap: '40px' }}>
            {filteredCourses.map((course, index) => (
          <div 
            key={course.id} 
            className="col-lg-4 col-md-6 col-sm-12" 
            data-aos="fade-up" 
            data-aos-delay={index * 100}
          >
            <div className="course-card">
              {/* Course Image */}
              <div className="course-image">
                <Image
                  src={course.thumbnail || "/images/resource/course-1.jpg"}
                  alt={course.title}
                  width={400}
                  height={225}
                  style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                />
              </div>

              {/* Course Content */}
              <div className="course-content">
                <h3 className="course-title">
                  <Link href={`/courses/${course.slug || course.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    {course.title}
                  </Link>
                </h3>

                <p className="course-subtitle">
                  {course.description}
                </p>

                <div className="course-instructor">
                  {course.instructor}
                </div>

                <div className="course-rating">
                  {course.is_bestseller && (
                    <span className="bestseller-badge">Bestseller</span>
                  )}
                  <span className="rating-stars">
                    <i className="la la-star"></i> {course.rating || 0}
                  </span>
                  <span className="rating-count">({course.total_reviews || 0} ratings)</span>
                  <span className="course-meta-item">{course.duration}</span>
                </div>

                <div className="course-level">
                  {course.level}
                </div>

                <div className="course-footer">
                  <div className="course-price">
                    <span className="current-price">{!course.price || course.price === 0 || course.price === "Free" ? "Free" : `$${course.price}`}</span>
                    <span className="original-price">{course.originalPrice}</span>
                  </div>
                  <Link href={`/courses/${course.id}`} className="add-to-cart-btn">
                    Start Learning
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      </>
      )}

      <style jsx>{`
        .course-card {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
          border: 1px solid #d1d7dc;
        }

        .course-card:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.2);
          transform: translateY(-4px);
        }

        .course-image {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
          background: #f7f9fa;
        }

        .course-content {
          padding: 16px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .course-title {
          font-size: 16px;
          font-weight: 700;
          color: #1c1d1f;
          margin-bottom: 8px;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .course-subtitle {
          font-size: 13px;
          color: #6a6f73;
          margin-bottom: 8px;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .course-instructor {
          font-size: 12px;
          color: #6a6f73;
          margin-bottom: 8px;
        }

        .course-rating {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 8px;
          flex-wrap: wrap;
          font-size: 12px;
        }

        .bestseller-badge {
          background: #eceb98;
          color: #3d3c0a;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
        }

        .rating-stars {
          color: #b4690e;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .rating-stars i {
          color: #b4690e;
        }

        .rating-count {
          color: #6a6f73;
          font-size: 12px;
        }

        .course-meta-item {
          color: #6a6f73;
          font-size: 12px;
        }

        .course-level {
          display: inline-block;
          padding: 4px 8px;
          background: #f7f9fa;
          border: 1px solid #d1d7dc;
          border-radius: 4px;
          font-size: 12px;
          color: #1c1d1f;
          margin-bottom: 12px;
          width: fit-content;
        }

        .course-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 12px;
        }

        .course-price {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .current-price {
          font-size: 20px;
          font-weight: 700;
          color: #1c1d1f;
        }

        .original-price {
          font-size: 16px;
          color: #6a6f73;
          text-decoration: line-through;
        }

        .add-to-cart-btn {
          background: transparent;
          color: #5624d0;
          border: 2px solid #5624d0;
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
        }

        .add-to-cart-btn:hover {
          background: #5624d0;
          color: white;
        }

        @media (max-width: 767px) {
          .course-title {
            font-size: 15px;
          }

          .course-subtitle {
            font-size: 12px;
          }

          .current-price {
            font-size: 18px;
          }
        }
      `}</style>
    </>
  );
};

export default CoursesList;
