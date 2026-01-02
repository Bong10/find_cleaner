"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectEmployerProfile,
  saveEmployerProfile,
} from "@/store/slices/employerProfileSlice";

export default function CleaningPreferencesBox() {
  const dispatch = useDispatch();
  const {
    cleaning_frequency,
    preferred_time_of_day,
    cleaning_priorities,
    supplies_provided,
    special_requirements,
    saving,
  } = useSelector(selectEmployerProfile);

  const [formData, setFormData] = useState({
    cleaning_frequency: "",
    preferred_time_of_day: "",
    cleaning_priorities: [],
    supplies_provided: "",
    special_requirements: "",
    other_priority_details: "", // New local state
  });

  useEffect(() => {
    // Attempt to extract "Other Priority" from special_requirements
    let spec = special_requirements || "";
    let other = "";
    
    if (spec.includes("Other Priority: ")) {
      const parts = spec.split("Other Priority: ");
      spec = parts[0].trim();
      other = parts[1].trim();
    }

    setFormData({
      cleaning_frequency: cleaning_frequency || "",
      preferred_time_of_day: preferred_time_of_day || "",
      cleaning_priorities: cleaning_priorities || [],
      supplies_provided: supplies_provided || "",
      special_requirements: spec,
      other_priority_details: other,
    });
  }, [
    cleaning_frequency,
    preferred_time_of_day,
    cleaning_priorities,
    supplies_provided,
    special_requirements,
  ]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePriorityChange = (priority) => {
    setFormData((prev) => {
      const current = prev.cleaning_priorities || [];
      if (current.includes(priority)) {
        return { ...prev, cleaning_priorities: current.filter((p) => p !== priority) };
      } else {
        return { ...prev, cleaning_priorities: [...current, priority] };
      }
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    
    // Re-combine special_requirements and other_priority_details
    let finalSpec = formData.special_requirements;
    if (formData.cleaning_priorities.includes('not_listed') && formData.other_priority_details) {
      finalSpec = (finalSpec ? finalSpec + "\n\n" : "") + "Other Priority: " + formData.other_priority_details;
    }

    dispatch(saveEmployerProfile({
      ...formData,
      special_requirements: finalSpec
    }));
  };

  const frequencies = [
    { id: 'one_time', label: 'One-time' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'bi_weekly', label: 'Bi-weekly' },
    { id: 'monthly', label: 'Monthly' }
  ];

  const timeSlots = [
    { id: 'morning', label: 'Morning (8 AM - 12 PM)' },
    { id: 'afternoon', label: 'Afternoon (12 PM - 5 PM)' },
    { id: 'evening', label: 'Evening (5 PM - 9 PM)' },
    { id: 'flexible', label: 'Flexible' }
  ];

  const priorities = [
    { id: 'kitchen', label: 'Kitchen Deep Clean' },
    { id: 'bathroom', label: 'Bathroom Sanitization' },
    { id: 'floors', label: 'Floor Care' },
    { id: 'windows', label: 'Window Cleaning' },
    { id: 'not_listed', label: 'Other' }
  ];

  return (
    <form className="default-form" onSubmit={onSubmit}>
      <div className="row">
        <div className="form-group col-lg-6 col-md-12">
          <label>Cleaning Frequency</label>
          <select
            name="cleaning_frequency"
            className="chosen-single form-select"
            value={formData.cleaning_frequency}
            onChange={handleChange}
          >
            <option value="">Select Frequency</option>
            {frequencies.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
          </select>
        </div>

        <div className="form-group col-lg-6 col-md-12">
          <label>Preferred Time</label>
          <select
            name="preferred_time_of_day"
            className="chosen-single form-select"
            value={formData.preferred_time_of_day}
            onChange={handleChange}
          >
            <option value="">Select Time</option>
            {timeSlots.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </div>

        <div className="form-group col-lg-12 col-md-12">
          <label>Cleaning Priorities</label>
          <div className="checkbox-outer" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '10px' }}>
            {priorities.map(p => (
              <div className="checkbox-box-2" key={p.id}>
                <input
                  type="checkbox"
                  id={`priority-${p.id}`}
                  checked={formData.cleaning_priorities?.includes(p.id)}
                  onChange={() => handlePriorityChange(p.id)}
                />
                <label htmlFor={`priority-${p.id}`} style={{ marginLeft: '8px' }}>{p.label}</label>
              </div>
            ))}
          </div>
        </div>
          
        {/* Custom Priority Input - Only shows when 'Other' is checked */}
        {formData.cleaning_priorities?.includes('not_listed') && (
          <div className="form-group col-lg-6 col-md-12">
            <label>Please specify other priority</label>
            <input
              type="text"
              name="other_priority_details"
              value={formData.other_priority_details}
              onChange={handleChange}
              placeholder="e.g. Garage cleaning, Patio, etc."
            />
          </div>
        )}

        <div className="form-group col-lg-6 col-md-12">
          <label>Supplies Provided?</label>
          <select
            name="supplies_provided"
            className="chosen-single form-select"
            value={formData.supplies_provided}
            onChange={handleChange}
          >
            <option value="">Select Option</option>
            <option value="yes">I provide supplies</option>
            <option value="no">Cleaner brings supplies</option>
          </select>
        </div>

        <div className="form-group col-lg-12 col-md-12">
          <label>Special Requirements</label>
          <textarea
            name="special_requirements"
            placeholder="Allergies, specific focus areas, etc."
            value={formData.special_requirements}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="form-group col-lg-12 col-md-12">
          <button className="theme-btn btn-style-one" disabled={saving}>
            {saving ? "Saving..." : "Save Preferences"}
          </button>
        </div>
      </div>
    </form>
  );
}
