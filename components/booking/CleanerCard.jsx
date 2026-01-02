"use client";

import Image from "next/image";

const CleanerCard = ({ cleaner, cleanerId }) => {
  const getCleanerName = () => {
    if (!cleaner) return "Cleaner";
    if (cleaner.name) return cleaner.name;
    
    const userData = cleaner.user || cleaner;
    if (userData.first_name && userData.last_name) {
      return `${userData.first_name} ${userData.last_name}`;
    }
    return userData.name || userData.email?.split("@")[0] || "Cleaner";
  };
  
  const getProfileImage = () => {
    if (!cleaner) return "/images/resource/candidate-1.png";
    
    const userData = cleaner.user || cleaner;
    if (userData.profile_picture) {
      if (userData.profile_picture.startsWith("http")) {
        return userData.profile_picture;
      }
      return `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}${userData.profile_picture}`;
    }
    return cleaner.avatar || "/images/resource/candidate-1.png";
  };
  
  return (
    <>
      <style jsx>{`
        .cleaner-card {
          background: white;
          border-radius: 20px;
          padding: 25px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          margin-bottom: 30px;
        }
        
        .cleaner-content {
          display: flex;
          align-items: center;
          gap: 25px;
        }
        
        .cleaner-avatar {
          position: relative;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          overflow: hidden;
          border: 4px solid #4C9A99;
          flex-shrink: 0;
        }
        
        .cleaner-info {
          flex: 1;
        }
        
        .cleaner-name {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 10px;
        }
        
        .cleaner-details {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
        }
        
        .detail-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #6b7280;
          font-size: 15px;
        }
        
        .detail-item i {
          color: #4C9A99;
          font-size: 18px;
        }
        
        .detail-item strong {
          color: #1f2937;
          font-weight: 600;
        }
        
        .verified-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: linear-gradient(135deg, rgba(76, 154, 153, 0.1) 0%, rgba(45, 95, 95, 0.1) 100%);
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 13px;
          color: #4C9A99;
          font-weight: 600;
        }
        
        @media (max-width: 768px) {
          .cleaner-content {
            flex-direction: column;
            text-align: center;
          }
          
          .cleaner-details {
            justify-content: center;
          }
        }
      `}</style>
      
      <div className="cleaner-card">
        <div className="cleaner-content">
          <div className="cleaner-avatar">
            <Image
              src={getProfileImage()}
              alt={getCleanerName()}
              width={100}
              height={100}
              style={{ objectFit: 'cover' }}
            />
          </div>
          
          <div className="cleaner-info">
            <h3 className="cleaner-name">{getCleanerName()}</h3>
            <div className="cleaner-details">
              <div className="detail-item">
                <i className="la la-pound-sign"></i>
                <span>Hourly Rate: <strong>£{cleaner?.hourly_rate || 20}/hr</strong></span>
              </div>
              
              {cleaner?.averageRating && (
                <div className="detail-item">
                  <i className="la la-star"></i>
                  <span>Rating: <strong>{cleaner.averageRating}</strong></span>
                </div>
              )}
              
              {cleaner?.location && (
                <div className="detail-item">
                  <i className="la la-map-marker"></i>
                  <span>{cleaner.location}</span>
                </div>
              )}
              
              {(cleaner?.isVerified || cleaner?.is_verified) && (
                <div className="verified-badge">
                  <i className="la la-check-circle"></i>
                  Verified
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CleanerCard;