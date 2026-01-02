import api from "@/utils/axiosConfig";

// Base path for learning API
const LEARNING_BASE_PATH = "/api/learning";

export const learningService = {
  // 1. Course Catalog (List All Courses)
  getAllCourses: async () => {
    const response = await api.get(`${LEARNING_BASE_PATH}/courses/`);
    return response.data;
  },

  // 2. Course Details & Curriculum
  getCourseBySlug: async (slug) => {
    const response = await api.get(`${LEARNING_BASE_PATH}/courses/${slug}/`);
    return response.data;
  },

  // 3. Enrolling a User
  enrollInCourse: async (slug) => {
    const response = await api.post(`${LEARNING_BASE_PATH}/courses/${slug}/enroll/`);
    return response.data;
  },

  // 4. My Learning Dashboard
  getMyLearning: async () => {
    const response = await api.get(`${LEARNING_BASE_PATH}/my-learning/`);
    return response.data;
  },

  // 5. Completing a Lesson (Text/Video)
  completeLesson: async (enrollmentId, lessonId) => {
    const response = await api.post(
      `${LEARNING_BASE_PATH}/my-learning/${enrollmentId}/complete_lesson/`,
      { lesson_id: lessonId }
    );
    return response.data;
  },

  // 6. Taking & Submitting a Quiz
  submitQuiz: async (enrollmentId, lessonId, answers) => {
    // answers format: { "QuestionID": AnswerID, ... }
    const response = await api.post(
      `${LEARNING_BASE_PATH}/my-learning/${enrollmentId}/submit_quiz/`,
      {
        lesson_id: lessonId,
        answers: answers,
      }
    );
    return response.data;
  },
};
