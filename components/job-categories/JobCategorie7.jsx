"use client"; // Mark as a Client Component

import Link from "next/link";
import jobCatContent from "../../data/job-catergories";
import { useEffect, useRef } from "react";

const JobCategorie7 = () => {
  const wrapperRef = useRef(null);

  // Add animation class for infinite scroll
  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.classList.add("job-cards");
    }
  }, []);

  return (
    <section className="post-job-section">
          <div className="text-section">
          <h1>Find the Right Help, Right Now</h1>
          <p>
            From home cleaning to office tasks, our platform makes it easy to connect with skilled professionals. Follow these simple steps:
          </p>
          <ul className="steps">
            <li>
              <span>1</span> <strong>Post Your Task:</strong> Describe what you need done.
            </li>
            <li>
              <span>2</span> <strong>Get Offers:</strong> Receive bids from professionals.
            </li>
            <li>
              <span>3</span> <strong>Choose the Best:</strong> Compare and hire.
            </li>
            <li>
              <span>4</span> <strong>Relax:</strong> Get the job done hassle-free.
            </li>
          </ul>
          <div className="buttons">
           <Link
              href="/employers-dashboard/post-jobs"
              className="theme-btn btn-style-one btn-blue"
            >
             Learn More
            </Link>
          </div>
        </div>


      <div className="job-cards-container">
        <div className="job-cards-wrapper" ref={wrapperRef}>
          {/* Render job cards twice for infinite scroll */}
          {[...Array(2)].map((_, index) => (
            <div key={index} className="job-cards">
              {jobCatContent.reduce((rows, item, idx) => {
                if (idx % 2 === 0) rows.push([]);
                rows[rows.length - 1].push(item);
                return rows;
              }, []).map((row, rowIndex) => (
                <div key={rowIndex} className="job-row">
                  {row.map((item) => (
                    <div key={item.id} className="job-card">
                      <img src={item.icon} alt={item.catTitle} />
                      <div>
                        <h3>{item.catTitle}</h3>
                        <p>{item.catDescription}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        /* Your CSS styles */

        .post-job-section {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin: 50px auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .text-section {
          flex: 1;
          padding: 20px;
        }

        .text-section h1 {
          font-size: 2.5rem;
          color: #002D72;
          margin-bottom: 10px;
        }

        .text-section p {
          font-size: 1.2rem;
          color: #555;
          margin-bottom: 20px;
        }

        .steps {
          list-style: none;
          padding: 0;
        }

        .steps li {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
          font-size: 1rem;
          color: #333;
        }

        .steps li span {
          display: inline-block;
          width: 30px;
          height: 30px;
          background-color: #0056D2;
          color: white;
          border-radius: 50%;
          font-weight: bold;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 10px;
        }

        .job-cards-container {
          flex: 1;
          position: relative;
          overflow: hidden;
          height: 400px;
        }

        .job-cards-wrapper {
          position: relative;
        }

        .job-cards {
          will-change: transform;
          animation: scrollUp 10s linear infinite;
        }

        .job-row {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          padding: 20px;
        }

        .job-card {
          flex: 1;
          background: #F5F7FB;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 20px;
          text-align: left;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .job-card img {
          width: 50px;
          height: 50px;
          border-radius: 5px;
        }

        .job-card h3 {
          font-size: 1rem;
          margin: 0;
          color: #333;
        }

        .job-card p {
          font-size: 0.9rem;
          color: #777;
          margin: 0;
        }

        @keyframes scrollUp {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-100%);
          }
        }
        
        @media (max-width: 1199px) {
            .post-job-section {
                padding: 10px;
            }
    
    
            .job-cards .job-row {
                flex-direction: column;
                gap: 20px; 
                padding: 10px 20px;
            }
        }

        @media (max-width: 768px) {
          .post-job-section {
            margin-top: -35px;
            }
          
            .post-job-section {
                flex-direction: column;
                padding: 10px;
            }
    
            .text-section {
                padding: 10px;
                width: 100%;
            }
    
            .text-section h1 {
                font-size: 1.5rem;
            }
    
            .text-section p {
                font-size: 0.9rem;
            }
    
            .job-cards-container {
                width: 100%;
                margin-top: -140px;
            }
    
            .job-cards .job-row {
                flex-direction: column; 
                gap: 0px; 
                padding: 0px 20px;
            }
    
            .job-card {
                height: auto; 
                margin: 15px 0; 
            }

            .job-cards-wrapper {
                height: 650px;
            }
        }
        @media (max-width: 480px) {

            .post-job-section {
            margin-top: -35px;
            }

            .text-section h1 {
                font-size: 1.2rem;
            }
    
            .text-section p {
                font-size: 0.8rem;
            }
    
            .steps li {
                font-size: 0.9rem;
            }
    
            .steps li span {
                width: 25px;
                height: 25px;
                font-size: 0.8rem;
            }
    
            .job-card img {
                width: 40px;
                height: 40px;
            }
    
            .job-card h3 {
                font-size: 1rem;
            }

            .job-cards-wrapper {
                height: 650px;
            }
    
            .job-card p {
                font-size: 0.8rem;
            }
            
            .job-cards-container {
                width: 100%;
                margin-top: -140px;
            }
        }

        
      `}</style>
    </section>
  );
};

export default JobCategorie7;
