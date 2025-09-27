const Social = () => {
  const socialContent = [
    { id: 1, icon: "fa-facebook-f", link: "https://www.facebook.com/" },
    { id: 2, icon: "fa-twitter", link: "https://www.twitter.com/" },
    { id: 3, icon: "fa-instagram", link: "https://www.instagram.com/" },
    { id: 4, icon: "fa-linkedin-in", link: "https://www.linkedin.com/" },
  ];
  
  return (
    <>
      <div className="social-icons-container">
        {socialContent.map((item) => (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            key={item.id}
            className="social-icon-link"
          >
            <i className={`fab ${item.icon}`}></i>
          </a>
        ))}
      </div>
      
      <style jsx>{`
        .social-icons-container {
          display: flex;
          gap: 0px;
          align-items: center;
        }
        
        .social-icon-link {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        
        .social-icon-link:hover {
          background-color: #e5e7eb;
          transform: translateY(-2px);
        }
        
        .social-icon-link i {
          color: #6b7280;
          font-size: 16px;
        }
        
        .social-icon-link:hover i {
          color: #374151;
        }
      `}</style>
    </>
  );
};

export default Social;