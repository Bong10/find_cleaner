'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import jobFeatured from '../../data/job-featured'; // Assuming the task data is imported here

const TaskSection = () => {
  const [tasksRow1, setTasksRow1] = useState([]);
  const [tasksRow2, setTasksRow2] = useState([]);

  useEffect(() => {
    // Split the dataset into two parts
    const midpoint = Math.ceil(jobFeatured.length / 2);
    setTasksRow1([...jobFeatured.slice(0, midpoint), ...jobFeatured.slice(0, midpoint)]);
    setTasksRow2([...jobFeatured.slice(midpoint), ...jobFeatured.slice(midpoint)]);
  }, []);

  return (
    <div>
      
      {/* First Tasks Section */}
      <div className="tasks-section">
        <div className="task-container">
          {tasksRow1.map((task, index) => (
            <div className="task-card" key={`task-${index}`}>
              <Image
                src={task.image}
                alt="Task Avatar"
                className="task-avatar"
                width={64}
                height={64}
              />
              <div className="task-details">
                <div className="task-category">{task.category}</div>
                <div className="task-title">{task.title}</div>
                {/* <div className="task-price">{task.price}</div> */}
                <div className="task-rating">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <span>{task.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="task-container">
          {tasksRow1.map((task, index) => (
            <div className="task-card" key={`task-reverse-${index}`}>
              <Image
                src={task.image}
                alt="Task Avatar"
                className="task-avatar"
                width={64}
                height={64}
              />
              <div className="task-details">
                <div className="task-category">{task.category}</div>
                <div className="task-title">{task.title}</div>
                {/* <div className="task-price">{task.price}</div> */}
                <div className="task-rating">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <span>{task.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Second Tasks Section */}
      <div className="tasks-section">
        <div className="task-container scroll-right">
          {tasksRow2.map((task, index) => (
            <div className="task-card" key={`task-scroll-${index}`}>
              <Image
                src={task.image}
                alt="Task Avatar"
                className="task-avatar"
                width={64}
                height={64}
              />
              <div className="task-details">
                <div className="task-category">{task.category}</div>
                <div className="task-title">{task.title}</div>
                {/* <div className="task-price">{task.price}</div> */}
                <div className="task-rating">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <span>{task.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="task-container scroll-right">
          {tasksRow2.map((task, index) => (
            <div className="task-card" key={`task-scroll-reverse-${index}`}>
              <Image
                src={task.image}
                alt="Task Avatar"
                className="task-avatar"
                width={64}
                height={64}
              />
              <div className="task-details">
                <div className="task-category">{task.category}</div>
                <div className="task-title">{task.title}</div>
                {/* <div className="task-price">{task.price}</div> */}
                <div className="task-rating">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <span>{task.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSS */}
      <style jsx>{`
        .tasks-section {
          display: flex;
          position: relative;
          overflow: hidden;
          margin-bottom: 30px;
        }

        .task-container {
          display: flex;
          gap: 20px;
          will-change: transform;
          animation: scrolling 30s linear infinite;
          padding-left: 20px;
        }

        .task-container.scroll-right {
          animation: scrolling-reverse 30s linear infinite;
        }

        @keyframes scrolling {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        @keyframes scrolling-reverse {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .task-card {
          background-color: #F5F7FB;
          border: 1px solid #ddd;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          width: 386px;
          padding: 15px;
          display: flex;
          gap: 15px;
          align-items: center;
          flex-shrink: 0;
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .task-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .task-avatar {
          border-radius: 50%;
          object-fit: cover;
        }

        .task-details {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .task-category {
          font-size: 14px;
          font-weight: bold;
          color: #555;
          margin-bottom: 5px;
        }

        .task-title {
          font-size: 16px;
          font-weight: normal;
          color: #222;
        }

        .task-price {
          font-size: 18px;
          font-weight: bold;
          color: #007bff;
        }

        .task-rating {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .task-rating svg {
          fill: #ffcc00;
          width: 20px;
          height: 20px;
        }

        .task-rating span {
          font-size: 14px;
          color: #555;
        }
      `}</style>
    </div>
  );
};

export default TaskSection;
