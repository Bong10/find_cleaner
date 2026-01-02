"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { learningService } from "@/services/learningService";

const CourseContext = createContext();

export const CourseProvider = ({ slug, children }) => {
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourseData = useCallback(async () => {
    try {
      setLoading(true);
      // 1. Fetch course details (curriculum)
      const courseData = await learningService.getCourseBySlug(slug);
      setCourse(courseData);

      // 2. Fetch enrollment details to get progress and enrollment ID
      // Since we don't have a direct endpoint for enrollment by slug, we fetch all my-learning
      // and find the matching course.
      // Optimization: If the API for getCourseBySlug returns enrollment info, we might not need this.
      // But the guide says "Use this [my-learning] to show the user's active courses and their progress bars."
      // And getCourseBySlug returns "is_enrolled": true.
      // If getCourseBySlug doesn't return enrollment_id, we need to fetch my-learning.
      
      if (courseData.is_enrolled) {
        const myLearning = await learningService.getMyLearning();
        const currentEnrollment = myLearning.find(e => e.course.id === courseData.id);
        setEnrollment(currentEnrollment);
      }

    } catch (err) {
      console.error("Error fetching course data:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      fetchCourseData();
    }
  }, [slug, fetchCourseData]);

  const refreshCourse = () => {
    fetchCourseData();
  };

  return (
    <CourseContext.Provider value={{ course, enrollment, loading, error, refreshCourse }}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourse = () => useContext(CourseContext);
