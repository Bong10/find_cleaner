"use client";

import { useState } from "react";
import api from "@/utils/axiosConfig";
import MobileMenu from "../../header/MobileMenu";
import LoginPopup from "../../common/form/login/LoginPopup";
import DefaulHeader2 from "../../header/DefaulHeader2";
import FooterDefault from "../../footer/common-footer";
import styles from "@/styles/CheckEligibility.module.scss";
import ReCAPTCHA from "react-google-recaptcha";

const CheckEligibility = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    contactInput: "",
    postcode: "",
    contactMethod: "",
    eligibility: [],
    consent: false,
    website: "", // honeypot
  });
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState("idle");
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === "eligibility") {
      setFormData((prev) => ({
        ...prev,
        eligibility: checked
          ? [...prev.eligibility, value]
          : prev.eligibility.filter(item => item !== value)
      }));
    } else {
      // sanitize text inputs immediately
      const sanitize = (text) => (text || "").toString()
        .replace(/<[^>]*>/g, "") // strip tags
        .replace(/[\u0000-\u001F\u007F]/g, "") // control chars
        .trim();
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : sanitize(value),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    // reCAPTCHA required
    if (!recaptchaToken) {
      setStatus("idle");
      alert("Please complete the reCAPTCHA.");
      return;
    }

    // Basic bot honeypot: if filled, silently succeed
    if (formData.website) {
      setSubmitted(true);
      setStatus("success");
      return;
    }

    // Whitelist eligibility values
    const ALLOWED = [
      "I am aged 65 or over",
      "I have a disability or long-term health condition",
      "I receive income-based or means-tested benefits",
      "I am temporarily unable to manage cleaning due to illness or recovery",
      "I am being referred by a carer, charity, or local authority",
    ];
    const uniq = Array.from(new Set(formData.eligibility || []));
    const safeEligibility = uniq.filter((v) => ALLOWED.includes(v)).slice(0, 10);

    // Sanitize specific fields with allowlists and max lengths
    const sanitizeName = (s) => (s || "").replace(/<[^>]*>/g, "").replace(/[^a-zA-Z \-'.]/g, "").trim().slice(0, 100);
    const sanitizePostcode = (s) => (s || "").replace(/<[^>]*>/g, "").replace(/[^a-zA-Z0-9 ]/g, "").trim().slice(0, 12);
    const sanitizeContact = (s) => (s || "").replace(/<[^>]*>/g, "").trim().slice(0, 100);

    const safeFullName = sanitizeName(formData.fullName);
    const safePostcode = sanitizePostcode(formData.postcode);
    const safeContact = sanitizeContact(formData.contactInput);

    if (!safeFullName || safeFullName.length < 2) {
      setStatus("idle");
      alert("Please enter a valid full name.");
      return;
    }
    if (!safePostcode) {
      setStatus("idle");
      alert("Please enter a valid postcode.");
      return;
    }

    const contactRaw = safeContact;
    const isEmail = contactRaw.includes("@");
    // Minimal format checks
    const emailOk = isEmail ? /.+@.+\..+/.test(contactRaw) : true;
    const phoneOk = !isEmail ? /^[0-9+()\-\s]{7,20}$/.test(contactRaw) : true;
    if (!emailOk || !phoneOk) {
      setStatus("idle");
      alert("Please enter a valid email or phone number.");
      return;
    }

    // Build payload expected by backend
    const payload = {
      full_name: safeFullName,
      postcode: safePostcode,
      contact_method: (formData.contactMethod === "email" || formData.contactMethod === "phone")
        ? formData.contactMethod
        : (isEmail ? "email" : "phone"),
      eligibility_criteria: safeEligibility,
      email: isEmail ? contactRaw : "",
      phone: !isEmail ? contactRaw : "",
      recaptcha_token: recaptchaToken || "",
    };

    try {
      const res = await api.post("/api/services/eligibility/", payload, { skipAuth: true, withCredentials: false });
      if (res.status === 201 || res.status === 200) {
        setSubmitted(true);
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error("Eligibility submission failed", err);
      setStatus("error");
    }
  };

  const eligibilityCriteria = [
    {
      icon: "la la-user",
      title: "Elderly Residents",
      description: "Individuals aged 65 and over who need assistance maintaining their home"
    },
    {
      icon: "la la-wheelchair",
      title: "People with Disabilities",
      description: "Those with physical or mental disabilities affecting daily activities"
    },
    {
      icon: "la la-hospital",
      title: "Post-Hospital Recovery",
      description: "Individuals recovering from surgery or illness who need temporary support"
    },
    {
      icon: "la la-home",
      title: "Financial Hardship",
      description: "Households facing financial difficulty who cannot afford regular cleaning"
    }
  ];

  return (
    <>
      <LoginPopup />
      <DefaulHeader2 />
      <MobileMenu />
      <span className="header-span"></span>

      {/* Page Title */}
      <section className="page-title">
        <div className="auto-container">
          <div className="title-outer">
            <h1>Check Eligibility for Support</h1>
            <ul className="page-breadcrumb">
              <li><a href="/">Home</a></li>
              <li>Check Eligibility</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className={styles.eligibilityHero}>
        <div className={styles.container}>
          <div className="row justify-content-center">
            <div className="col-lg-9 text-center">
              <h2 className={styles.heroTitle}>Supported Cleaning Services</h2>
              <p className={styles.heroSubtitle}>
                We provide subsidised cleaning support for people who may need extra help at home. 
                This process is simple, respectful, and confidential.
              </p>
              <p className={styles.confidenceNote}>
                This form is confidential. Information is only used to assess eligibility 
                and will not be shared without consent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Eligibility Criteria */}
      <section className={styles.criteriaSection}>
        <div className={styles.container}>
          <div className="sec-title text-center">
            <h3 className={styles.criteriaTitle}>Who Can Apply?</h3>
            <p className={styles.criteriaSubtitle}>Our programme is designed to help the following groups:</p>
          </div>
          <div className="row">
            {eligibilityCriteria.map((criteria, index) => (
              <div key={index} className="col-lg-3 col-md-6 col-sm-12">
                <div className={styles.criteriaCard}>
                  <div className={styles.iconBox}>
                    <span className={criteria.icon}></span>
                  </div>
                  <h4 className={styles.cardTitle}>{criteria.title}</h4>
                  <p className={styles.cardText}>{criteria.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className={styles.formSection}>
        <div className={styles.container}>
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <div className={styles.formWrapper}>
                {!submitted ? (
                  <>
                    <form onSubmit={handleSubmit}>
                      {/* honeypot for bots */}
                      <input
                        type="text"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        autoComplete="off"
                        tabIndex="-1"
                        aria-hidden="true"
                        style={{ position: "absolute", left: "-5000px", height: 0, width: 0 }}
                      />
                      {/* Who is this support for */}
                      <div className={styles.checkboxSection}>
                        <h3 className={styles.sectionTitle}>Who is this support for?</h3>
                        <div className={styles.eligibilityCheckboxes}>
                          <label className={styles.checkboxLabel}>
                            <input
                              type="checkbox"
                              name="eligibility"
                              value="I am aged 65 or over"
                              onChange={handleChange}
                            />
                            <span className={styles.checkmark}></span>
                            <span className={styles.labelText}>I am aged 65 or over</span>
                          </label>
                          <label className={styles.checkboxLabel}>
                            <input
                              type="checkbox"
                              name="eligibility"
                              value="I have a disability or long-term health condition"
                              onChange={handleChange}
                            />
                            <span className={styles.checkmark}></span>
                            <span className={styles.labelText}>I have a disability or long-term health condition</span>
                          </label>
                          <label className={styles.checkboxLabel}>
                            <input
                              type="checkbox"
                              name="eligibility"
                              value="I receive income-based or means-tested benefits"
                              onChange={handleChange}
                            />
                            <span className={styles.checkmark}></span>
                            <span className={styles.labelText}>I receive income-based or means-tested benefits<br/><small>(e.g. Universal Credit, Pension Credit)</small></span>
                          </label>
                          <label className={styles.checkboxLabel}>
                            <input
                              type="checkbox"
                              name="eligibility"
                              value="I am temporarily unable to manage cleaning due to illness or recovery"
                              onChange={handleChange}
                            />
                            <span className={styles.checkmark}></span>
                            <span className={styles.labelText}>I am temporarily unable to manage cleaning due to illness or recovery</span>
                          </label>
                          <label className={styles.checkboxLabel}>
                            <input
                              type="checkbox"
                              name="eligibility"
                              value="I am being referred by a carer, charity, or local authority"
                              onChange={handleChange}
                            />
                            <span className={styles.checkmark}></span>
                            <span className={styles.labelText}>I am being referred by a carer, charity, or local authority</span>
                          </label>
                        </div>
                        <p className={styles.helperText}>You may qualify under more than one category.</p>
                      </div>

                      {/* Postcode Section */}
                      <div className={styles.postcodeSection}>
                        <h3 className={styles.sectionTitle}>Postcode</h3>
                        <p className={styles.sectionSubtitle}>We use your postcode to check local availability of supported cleaning.</p>
                      </div>

                      <div className="row">
                        <div className="col-12">
                          <div className={styles.formGroup}>
                            <input
                              type="text"
                              name="postcode"
                              value={formData.postcode}
                              onChange={handleChange}
                              placeholder="Postcode"
                              maxLength={12}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-12">
                          <div className={styles.formGroup}>
                            <input
                              type="text"
                              name="fullName"
                              value={formData.fullName}
                              onChange={handleChange}
                              placeholder="Full name"
                              maxLength={100}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-12">
                          <div className={styles.formGroup}>
                            <input
                              type="text"
                              name="contactInput"
                              value={formData.contactInput}
                              onChange={handleChange}
                              placeholder="Email or phone"
                              maxLength={100}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-12">
                          <div className={styles.formGroup}>
                            <select
                              name="contactMethod"
                              value={formData.contactMethod}
                              onChange={handleChange}
                            >
                              <option value="">Preferred contact method (optional)</option>
                              <option value="email">Email</option>
                              <option value="phone">Phone</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="col-12 text-center">
                          <p className={styles.formNote}>You don't need to provide medical details at this stage.</p>
                          <div style={{ display: "inline-block", marginBottom: 12 }}>
                            <ReCAPTCHA
                              sitekey="6Lf8cjIsAAAAAFV5mjJF0zYrU_k-XBJRrn9fefur"
                              onChange={(token) => setRecaptchaToken(token)}
                            />
                          </div>
                          <button type="submit" className={styles.submitBtn} disabled={status === "submitting"}>
                            {status === "submitting" ? "Sending..." : "Check My Eligibility"}
                          </button>
                        </div>
                      </div>
                    </form>
                  </>
                ) : (
                  <div className={styles.successMessage + " text-center"}>
                    <div className={styles.successIcon}>
                      <span className="la la-check-circle"></span>
                    </div>
                    <h3 className={styles.successTitle}>Application Submitted Successfully!</h3>
                    <p className={styles.successText}>
                      Thank you for your application. Our team will review your information 
                      and contact you within 3-5 working days.
                    </p>
                    <a href="/" className={styles.submitBtn}>
                      Return to Home
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterDefault footerStyle="alternate5" />

      {/* Page-scoped styles moved to CSS module for consistency */}
      <style jsx>{`
        .eligibility-hero {
          padding: 80px 0 60px;
          background: linear-gradient(135deg, #eef4ff 0%, #f8faff 100%);
        }
        .badge-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #1967d2;
          color: #fff;
          font-size: 13px;
          font-weight: 600;
          padding: 8px 18px;
          border-radius: 25px;
          margin-bottom: 25px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .badge-label .la {
          font-size: 16px;
        }
        .eligibility-hero h2 {
          font-size: 42px;
          font-weight: 700;
          color: #202124;
          margin-bottom: 20px;
          line-height: 1.2;
        }
        .eligibility-hero p {
          font-size: 18px;
          color: #5a5a5a;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.7;
        }
        .eligibility-criteria {
          padding: 80px 0;
          background: #fff;
        }
        .sec-title h3 {
          font-size: 32px;
          font-weight: 700;
          color: #202124;
          margin-bottom: 15px;
        }
        .sec-title p {
          font-size: 16px;
          color: #696969;
          margin-bottom: 50px;
        }
        .criteria-card {
          background: #fff;
          border: 1px solid #ecedf2;
          border-radius: 12px;
          padding: 35px 25px;
          text-align: center;
          height: 100%;
          transition: all 0.3s ease;
          margin-bottom: 30px;
        }
        .criteria-card:hover {
          border-color: #1967d2;
          box-shadow: 0 10px 30px rgba(25, 103, 210, 0.1);
          transform: translateY(-5px);
        }
        .icon-box {
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, #e8f0fe 0%, #d2e3fc 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          transition: all 0.3s ease;
        }
        .criteria-card:hover .icon-box {
          background: #1967d2;
        }
        .icon-box .la {
          font-size: 32px;
          color: #1967d2;
          transition: color 0.3s ease;
        }
        .criteria-card:hover .icon-box .la {
          color: #fff;
        }
        .criteria-card h4 {
          font-size: 18px;
          font-weight: 600;
          color: #202124;
          margin-bottom: 12px;
        }
        .criteria-card p {
          font-size: 14px;
          color: #696969;
          line-height: 1.6;
          margin: 0;
        }
        .application-form-section {
          padding: 80px 0 100px;
          background: #f8f9fa;
        }
        .form-wrapper {
          background: #fff;
          border-radius: 16px;
          padding: 50px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
        }
        .form-header {
          margin-bottom: 40px;
        }
        .form-header h3 {
          font-size: 28px;
          font-weight: 700;
          color: #202124;
          margin-bottom: 10px;
        }
        .form-header p {
          font-size: 16px;
          color: #696969;
        }
        .form-group {
          margin-bottom: 25px;
        }
        .form-group label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #202124;
          margin-bottom: 8px;
        }
        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 14px 18px;
          border: 1px solid #ecedf2;
          border-radius: 8px;
          font-size: 15px;
          color: #202124;
          transition: all 0.3s ease;
          background: #fff;
        }
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          border-color: #1967d2;
          outline: none;
          box-shadow: 0 0 0 3px rgba(25, 103, 210, 0.1);
        }
        .form-group textarea {
          resize: vertical;
          min-height: 120px;
        }
        .checkbox-group {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .checkbox-group input {
          width: auto;
          margin-top: 4px;
        }
        .checkbox-group label {
          font-weight: 400;
          font-size: 14px;
          color: #696969;
          line-height: 1.5;
          margin: 0;
        }
        .theme-btn {
          display: inline-block;
          padding: 16px 40px;
          background: #1967d2;
          color: #fff;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 20px;
        }
        .theme-btn:hover {
          background: #1558b8;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(25, 103, 210, 0.25);
        }
        .success-message {
          padding: 60px 40px;
        }
        .success-icon {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #e8f0fe 0%, #d2e3fc 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 30px;
        }
        .success-icon .la {
          font-size: 50px;
          color: #1967d2;
        }
        .success-message h3 {
          font-size: 28px;
          font-weight: 700;
          color: #202124;
          margin-bottom: 15px;
        }
        .success-message p {
          font-size: 16px;
          color: #696969;
          max-width: 400px;
          margin: 0 auto 30px;
          line-height: 1.7;
        }
        @media (max-width: 767px) {
          .eligibility-hero h2 {
            font-size: 28px;
          }
          .form-wrapper {
            padding: 30px 25px;
          }
          .sec-title h3 {
            font-size: 26px;
          }
        }
      `}</style>
    </>
  );
};

export default CheckEligibility;
