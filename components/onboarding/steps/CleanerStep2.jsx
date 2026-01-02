// components/onboarding/steps/CleanerStep2.jsx
"use client";
import { useState, useRef, useEffect } from 'react';
import { fetchServices } from '@/services/jobsService';
import { searchLocations, getAllWorkingZones, isPointInZones } from "@/services/locationService";
import ZoneMapPreview from "../../dashboard-pages/candidates-dashboard/services/components/ZoneMapPreview";

const CleanerStep2 = ({ formData, errors, onUpdate }) => {
  const [locationInput, setLocationInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [workingZones, setWorkingZones] = useState([]);
  const [zonesLoaded, setZonesLoaded] = useState(false);
  const [searchingLocations, setSearchingLocations] = useState(false);
  const searchTimeoutRef = useRef(null);
  const inputRef = useRef(null);

  // Load working zones on mount
  useEffect(() => {
    (async () => {
      try {
        const zones = await getAllWorkingZones();
        setWorkingZones(zones);
        setZonesLoaded(true);
      } catch (error) {
        console.error("Failed to load zones:", error);
        setZonesLoaded(true);
      }
    })();
  }, []);

  // Fetch services from backend on component mount
  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoadingServices(true);
        const servicesData = await fetchServices();
        
        // Transform backend data to match our format
        const formattedServices = servicesData.map(service => ({
          id: service.id.toString(),
          label: service.name,
          icon: getServiceIcon(service.name) // Get icon based on service name
        }));
        
        setServiceTypes(formattedServices);
      } catch (error) {
        console.error('Failed to load services:', error);
        // Fallback to default services if backend fails
        setServiceTypes([
          { id: 'house', label: 'House Cleaning', icon: '🏠' },
          { id: 'office', label: 'Office Cleaning', icon: '🏢' },
          { id: 'deep', label: 'Deep Cleaning', icon: '✨' },
          { id: 'move', label: 'Move In/Out', icon: '📦' },
          { id: 'window', label: 'Window Cleaning', icon: '🪟' },
          { id: 'carpet', label: 'Carpet Cleaning', icon: '🏘️' },
          { id: 'laundry', label: 'Laundry Service', icon: '👔' },
          { id: 'organizing', label: 'Organizing', icon: '📂' }
        ]);
      } finally {
        setLoadingServices(false);
      }
    };

    loadServices();
  }, []);

  // Helper function to get icon based on service name
  const getServiceIcon = (serviceName) => {
    const name = serviceName.toLowerCase();
    if (name.includes('house') || name.includes('home') || name.includes('domestic')) return '🏠';
    if (name.includes('office') || name.includes('commercial')) return '🏢';
    if (name.includes('deep')) return '✨';
    if (name.includes('move') || name.includes('tenancy')) return '📦';
    if (name.includes('window')) return '🪟';
    if (name.includes('carpet') || name.includes('rug')) return '🏘️';
    if (name.includes('laundry') || name.includes('ironing')) return '👔';
    if (name.includes('organiz')) return '📂';
    if (name.includes('garden') || name.includes('outdoor')) return '🌳';
    if (name.includes('kitchen')) return '🍳';
    return '✨'; // Default icon
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocationInput = (value) => {
    setLocationInput(value);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (value.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setSearchingLocations(true);
      try {
        const response = await searchLocations(value.trim());
        let results = response.data?.locations || [];
        
        // Filter against zones if loaded
        if (zonesLoaded && workingZones.length > 0) {
          results = results.filter(loc => {
            if (loc.lat && loc.lng) {
              return isPointInZones(loc.lat, loc.lng, workingZones);
            }
            return true;
          });
        }

        setSuggestions(results);
        // Always show suggestions to display "No results" if needed
        setShowSuggestions(true);
      } catch (err) {
        console.error("Location search error:", err);
        setSuggestions([]);
      } finally {
        setSearchingLocations(false);
      }
    }, 300);
  };

  const addLocation = (location) => {
    const currentAreas = formData.service_areas || [];
    // Check for duplicates (handling both strings and objects)
    const isDuplicate = currentAreas.some(area => {
      const areaName = typeof area === 'string' ? area : area.name;
      const newName = typeof location === 'string' ? location : location.name;
      return areaName.toLowerCase() === newName.toLowerCase();
    });

    if (!isDuplicate) {
      onUpdate('service_areas', [...currentAreas, location]);
    }
    setLocationInput('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const removeLocation = (locationToRemove) => {
    const currentAreas = formData.service_areas || [];
    onUpdate('service_areas', currentAreas.filter(area => {
      const areaName = typeof area === 'string' ? area : area.name;
      const removeName = typeof locationToRemove === 'string' ? locationToRemove : locationToRemove.name;
      return areaName !== removeName;
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestions.length > 0) {
        addLocation(suggestions[0]);
      }
    }
  };
  
  const availabilityDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const [availability, setAvailability] = useState(formData.availability || {});

  const toggleService = (serviceId) => {
    const current = formData.service_types || [];
    if (current.includes(serviceId)) {
      onUpdate('service_types', current.filter(s => s !== serviceId));
    } else {
      onUpdate('service_types', [...current, serviceId]);
    }
  };

  const toggleDay = (day) => {
    const newAvailability = {
      ...availability,
      [day]: !availability[day]
    };
    setAvailability(newAvailability);
    onUpdate('availability', newAvailability);
  };

  return (
    <div className="step-container">
      <div className="step-header">
        <h2>Your Professional Details</h2>
        <p>Tell us about your cleaning experience and services</p>
      </div>

      <div className="form-content">
        {/* Years of Experience */}
        <div className="form-group">
          <label className="form-label">
            Years of Experience <span className="required">*</span>
          </label>
          <div className="experience-options">
            {['Less than 1', '1-2', '3-5', '5-10', '10+'].map(option => (
              <button
                key={option}
                type="button"
                onClick={() => onUpdate('years_of_experience', option)}
                className={`experience-btn ${formData.years_of_experience === option ? 'active' : ''}`}
              >
                {option} {option === 'Less than 1' ? 'year' : 'years'}
              </button>
            ))}
          </div>
          {errors.years_of_experience && <span className="error-message">{errors.years_of_experience}</span>}
        </div>

        {/* Service Types */}
        <div className="form-group">
          <label className="form-label">
            Services You Offer <span className="required">*</span>
          </label>
          {loadingServices ? (
            <div className="services-loading">
              <div className="spinner"></div>
              <p>Loading services...</p>
            </div>
          ) : (
            <div className="services-grid">
              {serviceTypes.map(service => (
                <div
                  key={service.id}
                  onClick={() => toggleService(service.id)}
                  className={`service-card ${formData.service_types?.includes(service.id) ? 'selected' : ''}`}
                >
                  <span className="service-icon">{service.icon}</span>
                  <span className="service-label">{service.label}</span>
                  {formData.service_types?.includes(service.id) && (
                    <span className="check-mark">✓</span>
                  )}
                </div>
              ))}
            </div>
          )}
          {errors.service_types && <span className="error-message">{errors.service_types}</span>}
        </div>

        {/* Availability */}
        <div className="form-group">
          <label className="form-label">
            Your Availability
          </label>
          <div className="availability-grid">
            {availabilityDays.map(day => (
              <div
                key={day}
                onClick={() => toggleDay(day)}
                className={`day-chip ${availability[day] ? 'active' : ''}`}
              >
                {day.slice(0, 3)}
              </div>
            ))}
          </div>
        </div>

        {/* Minimum Booking Hours */}
        <div className="form-group">
          <label className="form-label">
            Minimum Booking Hours <span className="required">*</span>
          </label>
          <div className="hours-options">
            {[1, 2, 3, 4].map(hours => (
              <button
                key={hours}
                type="button"
                onClick={() => onUpdate('minimum_hours', hours)}
                className={`hour-btn ${formData.minimum_hours === hours ? 'active' : ''}`}
              >
                {hours} {hours === 1 ? 'hour' : 'hours'}
              </button>
            ))}
          </div>
          {errors.minimum_hours && <span className="error-message">{errors.minimum_hours}</span>}
        </div>

        {/* Service Areas */}
        <div className="form-group">
          <label className="form-label">
            Service Areas (Cities/Neighborhoods)
          </label>
          <div className="location-input-wrapper" ref={inputRef}>
            <input
              type="text"
              value={locationInput}
              onChange={(e) => handleLocationInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => locationInput && setShowSuggestions(true)}
              className="form-input"
              placeholder="Type a city or neighborhood..."
            />
            {showSuggestions && (
              <div className="suggestions-dropdown">
                {suggestions.length > 0 ? (
                  suggestions.map((location, idx) => (
                    <div
                      key={idx}
                      onClick={() => addLocation(location)}
                      className="suggestion-item"
                    >
                      <span className="location-icon">📍</span>
                      <div className="location-info">
                        <div className="location-name">{location.name}</div>
                        {location.type && <div className="location-type">{location.type}</div>}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-results">
                    <div className="no-results-icon">🔍</div>
                    <p>No locations found</p>
                    <small>We couldn't find any matching locations in our service zones.</small>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {formData.service_areas && formData.service_areas.length > 0 && (
            <div className="selected-locations">
              {formData.service_areas.map((area, idx) => (
                <div key={idx} className="location-chip">
                  <span>{typeof area === 'string' ? area : area.name}</span>
                  <button
                    type="button"
                    onClick={() => removeLocation(area)}
                    className="remove-btn"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Zone Map Preview */}
          {zonesLoaded && workingZones.length > 0 && (
            <div className="map-preview-container">
              <ZoneMapPreview zones={workingZones} selectedAreas={formData.service_areas || []} />
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .step-container {
          background: white;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          overflow: visible;
        }

        .step-header {
          margin-bottom: 40px;
        }

        .step-header h2 {
          font-size: 32px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 8px;
        }

        .step-header p {
          font-size: 16px;
          color: #6b7280;
        }

        .form-content {
          display: flex;
          flex-direction: column;
          gap: 32px;
          overflow: visible;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .form-label {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 12px;
        }

        .required {
          color: #ef4444;
        }

        .experience-options {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .experience-btn {
          padding: 10px 20px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          color: #6b7280;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .experience-btn:hover {
          border-color: #4b9b97;
        }

        .experience-btn.active {
          background: #4b9b97;
          color: white;
          border-color: #4b9b97;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 12px;
        }

        .service-card {
          position: relative;
          padding: 16px 12px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: white;
        }

        .service-card:hover {
          border-color: #4b9b97;
          transform: translateY(-2px);
        }

        .service-card.selected {
          background: linear-gradient(135deg, #f0f9f7 0%, #e8f5f3 100%);
          border-color: #4b9b97;
        }

        .service-icon {
          display: block;
          font-size: 28px;
          margin-bottom: 8px;
        }

        .service-label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: #374151;
        }

        .check-mark {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 20px;
          height: 20px;
          background: #4b9b97;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
        }

        .availability-grid {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .day-chip {
          padding: 10px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 20px;
          background: white;
          color: #6b7280;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .day-chip:hover {
          border-color: #4b9b97;
        }

        .day-chip.active {
          background: #4b9b97;
          color: white;
          border-color: #4b9b97;
        }

        .form-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 16px;
          outline: none;
          transition: border-color 0.3s ease;
        }

        .form-input:focus {
          border-color: #4b9b97;
        }

        .location-input-wrapper {
          position: relative;
          width: 100%;
        }

        .suggestions-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 2px solid #4b9b97;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          max-height: 350px;
          overflow-y: auto;
          overflow-x: hidden;
          z-index: 1000;
          margin-top: 8px;
        }

        .suggestions-dropdown::-webkit-scrollbar {
          width: 8px;
        }

        .suggestions-dropdown::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 4px;
        }

        .suggestions-dropdown::-webkit-scrollbar-thumb {
          background: #4b9b97;
          border-radius: 4px;
        }

        .suggestions-dropdown::-webkit-scrollbar-thumb:hover {
          background: #3a7d79;
        }

        .suggestion-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 18px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #374151;
          font-size: 15px;
          border-bottom: 1px solid #f3f4f6;
        }

        .suggestion-item:last-child {
          border-bottom: none;
        }

        .suggestion-item:hover {
          background-color: #e8f5f3;
          color: #2d7a72;
        }

        .suggestion-item:hover .location-icon {
          color: #2d7a72;
        }

        .location-icon {
          width: 22px;
          height: 22px;
          color: #4b9b97;
          flex-shrink: 0;
          transition: color 0.2s ease;
        }

        .selected-locations {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
        }

        .location-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: #e8f5f3;
          color: #2d7a72;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
        }

        .remove-btn {
          background: none;
          border: none;
          color: #2d7a72;
          font-size: 20px;
          line-height: 1;
          cursor: pointer;
          padding: 0;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s ease;
        }

        .remove-btn:hover {
          color: #1a4d48;
        }

        .form-textarea {
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 16px;
          font-family: inherit;
          resize: vertical;
          outline: none;
        }

        .form-textarea:focus {
          border-color: #4b9b97;
        }

        .hours-options {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .location-info {
          display: flex;
          flex-direction: column;
        }

        .location-name {
          font-weight: 500;
          color: #111827;
        }

        .location-type {
          font-size: 12px;
          color: #6b7280;
        }

        .no-results {
          padding: 24px;
          text-align: center;
          color: #6b7280;
        }

        .no-results-icon {
          font-size: 24px;
          margin-bottom: 8px;
        }

        .map-preview-container {
          margin-top: 20px;
        }


        .hour-btn {
          padding: 10px 20px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          color: #6b7280;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .hour-btn:hover {
          border-color: #4b9b97;
        }

        .hour-btn.active {
          background: #4b9b97;
          color: white;
          border-color: #4b9b97;
        }

        .error-message {
          color: #ef4444;
          font-size: 13px;
          margin-top: 6px;
        }

        .services-loading {
          text-align: center;
          padding: 40px;
          background: #f9fafb;
          border-radius: 12px;
          border: 2px dashed #e5e7eb;
        }

        .services-loading p {
          color: #6b7280;
          font-size: 14px;
          margin-top: 12px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          margin: 0 auto;
          border: 4px solid #e5e7eb;
          border-top-color: #4b9b97;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default CleanerStep2;