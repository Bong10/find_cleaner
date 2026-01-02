// components/dashboard-pages/BreadCrumb.jsx
"use client";

const BreadCrumb = ({ title = "", text = "", firstName="" }) => {
  return (
    <div className="upper-title-box">
      <h3>{title}</h3>
      <div className="text">{text}</div>
    </div>
  );
};

export default BreadCrumb;
