"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCourse } from "../../CourseContext";
import { learningService } from "@/services/learningService";

// Simple Confetti Component
const Confetti = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 9999,
        overflow: "hidden",
      }}
    >
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: "-10px",
            left: `${Math.random() * 100}%`,
            width: "10px",
            height: "10px",
            background: ["#f7c32e", "#1967d2", "#e91e63", "#4caf50"][
              Math.floor(Math.random() * 4)
            ],
            animation: `fall ${Math.random() * 3 + 2}s linear infinite`,
            opacity: Math.random(),
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(720deg);
          }
        }
      `}</style>
    </div>
  );
};

const LessonPage = ({ params }) => {
  const { course, enrollment, loading, refreshCourse } = useCourse();
  const router = useRouter();
  const lessonId = parseInt(params.lessonId);

  const [lesson, setLesson] = useState(null);
  const [nextLessonId, setNextLessonId] = useState(null);
  const [prevLessonId, setPrevLessonId] = useState(null);
  const [completing, setCompleting] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);

  useEffect(() => {
    if (course && lessonId) {
      // Find current lesson and navigation
      let found = false;
      let prev = null;
      let current = null;
      let next = null;

      for (const module of course.modules) {
        for (const l of module.lessons) {
          if (found && !next) {
            next = l;
          }
          if (l.id === lessonId) {
            current = l;
            found = true;
            setPrevLessonId(prev ? prev.id : null);
          }
          if (!found) {
            prev = l;
          }
        }
      }

      setLesson(current);
      setNextLessonId(next ? next.id : null);
      
      // Reset state when lesson changes
      setQuizAnswers({});
      setQuizResult(null);
    }
  }, [course, lessonId]);

  if (loading) return <div>Loading...</div>;
  if (!course) return <div>Course not found</div>;
  if (!lesson) return <div>Lesson not found</div>;

  const handleComplete = async () => {
    if (!enrollment) return;
    setCompleting(true);
    try {
      await learningService.completeLesson(enrollment.id, lesson.id);
      refreshCourse(); // Update progress
      if (nextLessonId) {
        router.push(`/my-courses/${course.slug}/lessons/${nextLessonId}`);
      } else {
        // Course completed?
        router.push(`/my-courses/${course.slug}`);
      }
    } catch (error) {
      console.error("Failed to complete lesson:", error);
    } finally {
      setCompleting(false);
    }
  };

  const handleQuizSubmit = async () => {
    if (!enrollment) return;
    setSubmittingQuiz(true);
    try {
      const result = await learningService.submitQuiz(
        enrollment.id,
        lesson.id,
        quizAnswers
      );
      setQuizResult(result);
      if (result.passed) {
        refreshCourse();
      }
    } catch (error) {
      console.error("Failed to submit quiz:", error);
    } finally {
      setSubmittingQuiz(false);
    }
  };

  const handleAnswerSelect = (questionId, answerId) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      {quizResult?.passed && <Confetti />}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 style={{ fontSize: "28px", fontWeight: "700" }}>{lesson.title}</h1>
        {lesson.is_completed && (
          <span className="badge bg-success">Completed</span>
        )}
      </div>

      <div
        className="content-box"
        style={{
          background: "#fff",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
          marginBottom: "30px",
        }}
      >
        {lesson.content_type === "VIDEO" && (
          <div className="video-container mb-4">
            {/* Placeholder for video player */}
            <div
              style={{
                width: "100%",
                height: "400px",
                background: "#000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                borderRadius: "8px",
              }}
            >
              Video Player Placeholder (URL: {lesson.video_url})
            </div>
          </div>
        )}

        {lesson.content_type === "TEXT" && (
          <div
            className="lesson-content"
            dangerouslySetInnerHTML={{ __html: lesson.content }}
          />
        )}

        {lesson.content_type === "QUIZ" && lesson.quiz && (
          <div className="quiz-container">
            {quizResult ? (
              <div className="text-center mb-4">
                {quizResult.passed ? (
                  <div className="alert alert-success">
                    <h4>Congratulations! You Passed!</h4>
                    <p>Score: {quizResult.score}%</p>
                  </div>
                ) : (
                  <div className="alert alert-danger">
                    <h4>Keep Trying!</h4>
                    <p>Score: {quizResult.score}% (Required: {quizResult.passing_score}%)</p>
                    <button
                      className="btn btn-outline-danger mt-2"
                      onClick={() => setQuizResult(null)}
                    >
                      Retake Quiz
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div>
                {lesson.quiz.questions.map((q, index) => (
                  <div key={q.id} className="mb-4">
                    <h5 className="mb-3">
                      {index + 1}. {q.text}
                    </h5>
                    <div className="d-flex flex-column gap-2">
                      {q.answers.map((a) => (
                        <label
                          key={a.id}
                          className={`p-3 border rounded cursor-pointer ${
                            quizAnswers[q.id] === a.id
                              ? "border-primary bg-light"
                              : ""
                          }`}
                          style={{ cursor: "pointer" }}
                        >
                          <input
                            type="radio"
                            name={`q-${q.id}`}
                            value={a.id}
                            checked={quizAnswers[q.id] === a.id}
                            onChange={() => handleAnswerSelect(q.id, a.id)}
                            className="me-2"
                          />
                          {a.text}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                <button
                  className="theme-btn btn-style-one"
                  onClick={handleQuizSubmit}
                  disabled={
                    submittingQuiz ||
                    Object.keys(quizAnswers).length !==
                      lesson.quiz.questions.length
                  }
                >
                  {submittingQuiz ? "Submitting..." : "Submit Quiz"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="d-flex justify-content-between align-items-center">
        {prevLessonId ? (
          <Link
            href={`/my-courses/${course.slug}/lessons/${prevLessonId}`}
            className="btn btn-outline-secondary"
          >
            <i className="las la-arrow-left me-2"></i> Previous
          </Link>
        ) : (
          <div></div>
        )}

        {lesson.content_type !== "QUIZ" && (
          <button
            className="theme-btn btn-style-one"
            onClick={handleComplete}
            disabled={completing}
          >
            {completing ? "Completing..." : "Mark as Complete & Next"}
            <i className="las la-arrow-right ms-2"></i>
          </button>
        )}
        
        {lesson.content_type === "QUIZ" && quizResult?.passed && nextLessonId && (
             <Link
             href={`/my-courses/${course.slug}/lessons/${nextLessonId}`}
             className="theme-btn btn-style-one"
           >
             Next Lesson <i className="las la-arrow-right ms-2"></i>
           </Link>
        )}
      </div>
    </div>
  );
};

export default LessonPage;
