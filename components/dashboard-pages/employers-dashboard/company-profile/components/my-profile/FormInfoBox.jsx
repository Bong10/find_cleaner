"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectEmployerProfile,
  saveEmployerProfile,
} from "@/store/slices/employerProfileSlice";

export default function FormInfoBox() {
  const dispatch = useDispatch();
  const {
    first_name,
    last_name,
    email,
    phone_number,
    address,
    business_name,
    saving,
  } = useSelector(selectEmployerProfile);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    address: "",
    business_name: "",
  });

  // Sync state from Redux when loaded
  useEffect(() => {
    setFormData({
      first_name: first_name || "",
      last_name: last_name || "",
      phone_number: phone_number || "",
      address: address || "",
      business_name: business_name || "",
    });
  }, [
    first_name,
    last_name,
    phone_number,
    address,
    business_name,
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(saveEmployerProfile(formData));
  };

  return (
    <form className="default-form" onSubmit={onSubmit}>
      <div className="row">
        {/* --- Personal Info --- */}
        <div className="form-group col-lg-6 col-md-12">
          <label>First Name</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="John"
          />
        </div>

        <div className="form-group col-lg-6 col-md-12">
          <label>Last Name</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Doe"
          />
        </div>

        <div className="form-group col-lg-6 col-md-12">
          <label>Phone Number</label>
          <input
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            placeholder="0 123 456 7890"
          />
        </div>

        <div className="form-group col-lg-6 col-md-12">
          <label>Email Address</label>
          <input
            type="text"
            value={email}
            disabled
            className="disabled-input"
            style={{ backgroundColor: "#f5f5f5", cursor: "not-allowed" }}
          />
        </div>

        <div className="form-group col-lg-6 col-md-12">
          <label>Business Name (Optional)</label>
          <input
            type="text"
            name="business_name"
            value={formData.business_name}
            onChange={handleChange}
            placeholder="My Company Ltd"
          />
        </div>

        <div className="form-group col-lg-6 col-md-12">
          <label>Full Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="123 Main St, London"
          />
        </div>

        {/* Save Button */}
        <div className="form-group col-lg-12 col-md-12">
          <button className="theme-btn btn-style-one" disabled={saving}>
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </div>
    </form>
  );
}
