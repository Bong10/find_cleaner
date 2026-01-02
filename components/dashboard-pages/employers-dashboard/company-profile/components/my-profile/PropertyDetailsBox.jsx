"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectEmployerProfile,
  saveEmployerProfile,
} from "@/store/slices/employerProfileSlice";

export default function PropertyDetailsBox() {
  const dispatch = useDispatch();
  const {
    property_type,
    bedrooms,
    bathrooms,
    toilets,
    kitchens,
    rooms,
    parking_available,
    elevator_access,
    has_pets,
    access_instructions,
    saving,
  } = useSelector(selectEmployerProfile);

  const [formData, setFormData] = useState({
    property_type: "",
    bedrooms: "",
    bathrooms: "",
    toilets: "",
    kitchens: "",
    rooms: "",
    parking_available: false,
    elevator_access: false,
    has_pets: false,
    access_instructions: "",
  });

  useEffect(() => {
    setFormData({
      property_type: property_type || "",
      bedrooms: bedrooms || "",
      bathrooms: bathrooms || "",
      toilets: toilets || "",
      kitchens: kitchens || "",
      rooms: rooms || "",
      parking_available: parking_available || false,
      elevator_access: elevator_access || false,
      has_pets: has_pets || false,
      access_instructions: access_instructions || "",
    });
  }, [property_type, bedrooms, bathrooms, toilets, kitchens, rooms, parking_available, elevator_access, has_pets, access_instructions]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // For number inputs, we want to store them as numbers or empty strings
    if (['bedrooms', 'bathrooms', 'toilets', 'kitchens', 'rooms'].includes(name)) {
      const intVal = parseInt(value);
      setFormData((prev) => ({ ...prev, [name]: isNaN(intVal) ? '' : intVal }));
    } else if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(saveEmployerProfile(formData));
  };

  const propertyTypes = [
    { id: 'apartment', label: 'Apartment' },
    { id: 'house', label: 'House' },
    { id: 'office', label: 'Office' },
    { id: 'commercial', label: 'Commercial' }
  ];

  return (
    <form className="default-form" onSubmit={onSubmit}>
      <div className="row">
        <div className="form-group col-lg-12 col-md-12">
          <label>Property Type</label>
          <select
            name="property_type"
            className="chosen-single form-select"
            value={formData.property_type}
            onChange={handleChange}
          >
            <option value="">Select Type</option>
            {propertyTypes.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </div>

        {/* Fields for House/Apartment */}
        {(formData.property_type === 'house' || formData.property_type === 'apartment') && (
          <>
            <div className="form-group col-lg-6 col-md-12">
              <label>Bedrooms</label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                placeholder="0"
                min="0"
                step="1"
              />
            </div>
            <div className="form-group col-lg-6 col-md-12">
              <label>Bathrooms</label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                placeholder="0"
                min="0"
                step="1"
              />
            </div>
            <div className="form-group col-lg-6 col-md-12">
              <label>Toilets</label>
              <input
                type="number"
                name="toilets"
                value={formData.toilets}
                onChange={handleChange}
                placeholder="0"
                min="0"
                step="1"
              />
            </div>
            <div className="form-group col-lg-6 col-md-12">
              <label>Kitchens</label>
              <input
                type="number"
                name="kitchens"
                value={formData.kitchens}
                onChange={handleChange}
                placeholder="0"
                min="0"
                step="1"
              />
            </div>
          </>
        )}

        {/* Fields for Office/Commercial */}
        {(formData.property_type === 'office' || formData.property_type === 'commercial') && (
          <>
            <div className="form-group col-lg-6 col-md-12">
              <label>Rooms</label>
              <input
                type="number"
                name="rooms"
                value={formData.rooms}
                onChange={handleChange}
                placeholder="0"
                min="0"
                step="1"
              />
            </div>
            <div className="form-group col-lg-6 col-md-12">
              <label>Toilets</label>
              <input
                type="number"
                name="toilets"
                value={formData.toilets}
                onChange={handleChange}
                placeholder="0"
                min="0"
                step="1"
              />
            </div>
            <div className="form-group col-lg-6 col-md-12">
              <label>Kitchens</label>
              <input
                type="number"
                name="kitchens"
                value={formData.kitchens}
                onChange={handleChange}
                placeholder="0"
                min="0"
                step="1"
              />
            </div>
          </>
        )}

        {/* Parking & Access */}
        <div className="form-group col-lg-12 col-md-12">
          <label>Parking & Access</label>
          <div className="checkbox-outer" style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
            <div className="checkbox-box-2">
              <input
                type="checkbox"
                name="parking_available"
                id="parking_available"
                checked={formData.parking_available}
                onChange={handleChange}
              />
              <label htmlFor="parking_available" style={{ marginLeft: '8px' }}>Free parking available</label>
            </div>
            <div className="checkbox-box-2">
              <input
                type="checkbox"
                name="elevator_access"
                id="elevator_access"
                checked={formData.elevator_access}
                onChange={handleChange}
              />
              <label htmlFor="elevator_access" style={{ marginLeft: '8px' }}>Elevator access</label>
            </div>
            <div className="checkbox-box-2">
              <input
                type="checkbox"
                name="has_pets"
                id="has_pets"
                checked={formData.has_pets}
                onChange={handleChange}
              />
              <label htmlFor="has_pets" style={{ marginLeft: '8px' }}>Pets in property</label>
            </div>
          </div>
        </div>

        <div className="form-group col-lg-12 col-md-12">
          <label>Access Instructions</label>
          <textarea
            name="access_instructions"
            placeholder="Key code, doorman, etc."
            value={formData.access_instructions}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="form-group col-lg-12 col-md-12">
          <button className="theme-btn btn-style-one" disabled={saving}>
            {saving ? "Saving..." : "Save Details"}
          </button>
        </div>
      </div>
    </form>
  );
}
