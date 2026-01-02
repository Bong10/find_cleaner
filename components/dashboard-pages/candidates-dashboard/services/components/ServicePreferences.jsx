"use client";

import { useEffect, useState, useRef } from "react";
import { getCleanerMe, patchCleanerMe } from "@/services/cleanerService";
import { fetchServices } from "@/services/jobsService";
import { searchLocations, checkLocation, getAllWorkingZones, isPointInZones } from "@/services/locationService";
import { toast } from "react-toastify";
import ZoneMapPreview from "./ZoneMapPreview";

export default function ServicePreferences() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [services, setServices] = useState([]);
  const [locationInput, setLocationInput] = useState("");
  const [checkingLocation, setCheckingLocation] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchingLocations, setSearchingLocations] = useState(false);
  const [workingZones, setWorkingZones] = useState([]);
  const [zonesLoaded, setZonesLoaded] = useState(false);
  const searchTimeoutRef = useRef(null);
  const suggestionsRef = useRef(null);
  
  const [form, setForm] = useState({
    service_types: [],
    service_areas: [],
    availability: {},
  });

  const availabilityDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Pre-load all working zones on component mount
  useEffect(() => {
    (async () => {
      try {
        console.log("🗺️ [ServicePreferences] Pre-loading working zones...");
        const zones = await getAllWorkingZones();
        setWorkingZones(zones);
        setZonesLoaded(true);
        console.log(`✅ [ServicePreferences] Loaded ${zones.length} zones for client-side validation`);
      } catch (error) {
        console.error("❌ [ServicePreferences] Failed to load zones:", error);
        // Continue without zones - backend will still validate
        setZonesLoaded(true);
      }
    })();
  }, []);

  // Load services from backend
  useEffect(() => {
    (async () => {
      try {
        const servicesData = await fetchServices();
        setServices(servicesData);
      } catch (error) {
        console.error('Failed to load services:', error);
      }
    })();
  }, []);

  // Load current preferences
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await getCleanerMe();
        
        console.log("=== SERVICES DATA FROM BACKEND ===");
        console.log("Full cleaner data:", data);
        console.log("services field:", data?.services);
        console.log("service_types field:", data?.service_types);
        console.log("==================================");
        
        // Extract service IDs from services array (backend returns services as array of objects)
        const serviceIds = Array.isArray(data?.services) 
          ? data.services.map(s => s.id) 
          : (Array.isArray(data?.service_types) ? data.service_types : []);
        
        console.log("Extracted service IDs:", serviceIds);
        
        setForm({
          service_types: serviceIds,
          service_areas: Array.isArray(data?.service_areas) ? data.service_areas : [],
          availability: data?.availability || {},
        });
      } catch (e) {
        console.error("Failed to load preferences:", e);
        setError("Failed to load preferences.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search locations as user types
  const handleLocationInputChange = async (value) => {
    setLocationInput(value);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (value.trim().length < 2) {
      setLocationSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Debounce search
    searchTimeoutRef.current = setTimeout(async () => {
      setSearchingLocations(true);
      try {
        const response = await searchLocations(value.trim());
        let suggestions = response.data?.locations || [];
        
        // Client-side filtering against working zones (if loaded)
        // This ensures we only show suggestions that are actually within our drawn map zones
        if (zonesLoaded && workingZones.length > 0) {
          const originalCount = suggestions.length;
          suggestions = suggestions.filter(loc => {
            // If location has coordinates, check against our zones
            if (loc.lat && loc.lng) {
              return isPointInZones(loc.lat, loc.lng, workingZones);
            }
            // If no coordinates, keep it (fallback to backend validation)
            return true;
          });
          
          if (originalCount > 0 && suggestions.length === 0) {
            console.log("🚫 [ServicePreferences] All suggestions filtered out by client-side zone check");
          }
        }

        if (suggestions.length > 0) {
          setLocationSuggestions(suggestions);
          setShowSuggestions(true);
        } else {
          setLocationSuggestions([]);
          // Show suggestions box to display "No results" message
          if (value.trim().length >= 3) {
            setShowSuggestions(true);
          } else {
            setShowSuggestions(false);
          }
        }
      } catch (err) {
        console.error("Location search error:", err);
        setLocationSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setSearchingLocations(false);
      }
    }, 300); // 300ms debounce
  };

  const selectLocationSuggestion = async (suggestion) => {
    setShowSuggestions(false);
    setLocationInput("");
    setLocationSuggestions([]);
    
    // Check if already added
    const alreadyAdded = form.service_areas.some(
      area => typeof area === 'string' 
        ? area.toLowerCase() === suggestion.name.toLowerCase()
        : area.name?.toLowerCase() === suggestion.name.toLowerCase()
    );

    if (alreadyAdded) {
      toast.warning(`${suggestion.name} is already in your service areas`);
      return;
    }

    // Add the location with its boundary data
    setForm(prev => ({
      ...prev,
      service_areas: [...prev.service_areas, suggestion]
    }));
    
    toast.success(`${suggestion.name} added to service areas`);
  };

  const toggleService = (serviceId) => {
    setForm(prev => ({
      ...prev,
      service_types: prev.service_types.includes(serviceId)
        ? prev.service_types.filter(id => id !== serviceId)
        : [...prev.service_types, serviceId]
    }));
  };

  const toggleDay = (day) => {
    setForm(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: !prev.availability[day]
      }
    }));
  };

  const addServiceArea = async (location) => {
    if (!location || location.trim() === "") {
      toast.warning("Please enter a location");
      return;
    }

    const locationName = location.trim();

    // Check if already added
    const alreadyAdded = form.service_areas.some(
      area => typeof area === 'string' 
        ? area.toLowerCase() === locationName.toLowerCase()
        : area.name?.toLowerCase() === locationName.toLowerCase()
    );

    if (alreadyAdded) {
      toast.warning("This location is already added");
      return;
    }

    setCheckingLocation(true);
    
    try {
      console.log("📍 [ServicePreferences] Checking location:", locationName);
      
      // Call backend to validate location and get boundary data
      const response = await checkLocation(locationName);
      const locationData = response.data;

      // Double-check against client-side zones if available
      // This ensures consistency with the map visualization
      if (zonesLoaded && workingZones.length > 0 && locationData.lat && locationData.lng) {
        const matchedZone = isPointInZones(locationData.lat, locationData.lng, workingZones);
        
        if (!matchedZone) {
          console.warn("❌ [ServicePreferences] Location rejected by client-side zone check:", locationData.name);
          toast.error("Sorry, this location is outside our current service jurisdiction.");
          setCheckingLocation(false);
          return;
        }
        
        console.log(`✅ [ServicePreferences] Client-side zone check passed: ${matchedZone.name}`);
        // Ensure zone_id is set correctly
        if (!locationData.zone_id) locationData.zone_id = matchedZone.id;
      }
      
      console.log("✅ [ServicePreferences] Location validated:", locationData);
      
      // Add to service areas
      setForm(prev => ({
        ...prev,
        service_areas: [...prev.service_areas, locationData]
      }));
      
      toast.success(`${locationData.name} added to service areas`);
      setLocationInput(""); // Clear input
      setShowSuggestions(false);
      
    } catch (err) {
      console.error("❌ [ServicePreferences] Location validation failed:", err);
      
      // Check if it's a zone restriction error
      if (err.response?.status === 403 || err.response?.data?.code === 'OUTSIDE_ZONE') {
        toast.error("Sorry, this location is outside our current service jurisdiction. Please try a different area.");
      } else if (err.response?.status === 404) {
        toast.error("Location not found. Please check the spelling or try a nearby city/postcode.");
      } else {
        const errorMsg = err.response?.data?.message || err.response?.data?.error || "Unable to add this location. Please try again.";
        toast.error(errorMsg);
      }
    } finally {
      setCheckingLocation(false);
    }
  };

  const removeServiceArea = (areaToRemove) => {
    setForm(prev => ({
      ...prev,
      service_areas: prev.service_areas.filter(area => {
        const areaName = typeof area === 'string' ? area : area.name;
        const removeName = typeof areaToRemove === 'string' ? areaToRemove : areaToRemove.name;
        return areaName !== removeName;
      })
    }));
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setOk("");

    const payload = {
      service_types: form.service_types,
      service_areas: form.service_areas,
      availability: form.availability,
    };

    try {
      console.log("📤 [ServicePreferences] Saving service preferences to backend:", payload);
      await patchCleanerMe(payload);
      console.log("✅ [ServicePreferences] Service preferences saved successfully");

      // Reload
      const { data } = await getCleanerMe();
      
      // Extract service IDs from services array
      const serviceIds = Array.isArray(data?.services) 
        ? data.services.map(s => s.id) 
        : (Array.isArray(data?.service_types) ? data.service_types : []);
      
      setForm({
        service_types: serviceIds,
        service_areas: Array.isArray(data?.service_areas) ? data.service_areas : [],
        availability: data?.availability || {},
      });

      setOk("Service preferences updated successfully!");
    } catch (e) {
      console.error("Save error:", e);
      setError("Failed to save preferences.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="widget-content">Loading...</div>;
  }

  return (
    <div className="widget-content">
      <form className="default-form" onSubmit={save}>
        {/* Services You Offer */}
        <div className="form-group col-lg-12">
          <label>Services You Offer *</label>
          <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginTop: '12px' }}>
            {services.map(service => (
              <div
                key={service.id}
                onClick={() => toggleService(service.id)}
                className={`service-card ${form.service_types.includes(service.id) ? 'selected' : ''}`}
                style={{
                  padding: '16px',
                  border: form.service_types.includes(service.id) ? '2px solid #1967d2' : '2px solid #e5e7eb',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  backgroundColor: form.service_types.includes(service.id) ? '#f0f9ff' : 'white',
                }}
              >
                <span style={{ fontSize: '24px', marginBottom: '8px', display: 'block' }}>
                  {service.icon || '✨'}
                </span>
                <span style={{ fontSize: '14px', fontWeight: 500 }}>{service.name}</span>
                {form.service_types.includes(service.id) && (
                  <span style={{ display: 'block', marginTop: '8px', color: '#1967d2' }}>✓</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Availability Days */}
        <div className="form-group col-lg-12" style={{ marginTop: '24px' }}>
          <label>Your Availability (Days of Week)</label>
          <div className="availability-grid" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '12px' }}>
            {availabilityDays.map(day => (
              <div
                key={day}
                onClick={() => toggleDay(day)}
                className={`day-chip ${form.availability[day] ? 'active' : ''}`}
                style={{
                  padding: '12px 24px',
                  border: form.availability[day] ? '2px solid #1967d2' : '2px solid #e5e7eb',
                  borderRadius: '24px',
                  cursor: 'pointer',
                  backgroundColor: form.availability[day] ? '#1967d2' : 'white',
                  color: form.availability[day] ? 'white' : '#6b7280',
                  fontWeight: 500,
                  transition: 'all 0.3s ease',
                }}
              >
                {day.slice(0, 3)}
              </div>
            ))}
          </div>
        </div>

        {/* Service Areas */}
        <div className="form-group col-lg-12" style={{ marginTop: '24px' }}>
          <label>Service Areas (Cities/Postcodes/Regions) *</label>
          
          {/* Zone Map Preview - Moved below selected areas */}
          
          <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px', marginBottom: '12px' }}>
            Start typing a postcode, city, or region name to see suggestions from the zones above
          </p>
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              <input
                type="text"
                placeholder="Type a postcode, city, or region (e.g., M1, Manchester, Greater Manchester)..."
                value={locationInput}
                onChange={(e) => handleLocationInputChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (locationSuggestions.length > 0) {
                      selectLocationSuggestion(locationSuggestions[0]);
                    }
                  } else if (e.key === 'Escape') {
                    setShowSuggestions(false);
                  }
                }}
                disabled={checkingLocation}
                className="form-control"
                style={{ flex: 1 }}
              />
            </div>

            {/* Autocomplete Dropdown */}
            {showSuggestions && (
              <div
                ref={suggestionsRef}
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: '0', // Full width
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  zIndex: 1000,
                  marginTop: '4px',
                }}
              >
                {locationSuggestions.length > 0 ? (
                  locationSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      onClick={() => selectLocationSuggestion(suggestion)}
                      style={{
                        padding: '12px 16px',
                        cursor: 'pointer',
                        borderBottom: index < locationSuggestions.length - 1 ? '1px solid #f3f4f6' : 'none',
                        transition: 'background-color 0.2s ease',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '16px' }}>📍</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 500, color: '#111827' }}>
                            {suggestion.name}
                          </div>
                          {suggestion.type && (
                            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                              {suggestion.type}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '16px', textAlign: 'center', color: '#6b7280' }}>
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔍</div>
                    <p style={{ margin: 0, fontWeight: 500 }}>No locations found</p>
                    <p style={{ margin: '4px 0 0', fontSize: '12px' }}>
                      We couldn't find any matching locations in our service zones.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Loading Indicator */}
            {searchingLocations && locationInput.trim().length >= 2 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: '140px',
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '16px',
                textAlign: 'center',
                color: '#6b7280',
                marginTop: '-8px',
                zIndex: 1000,
              }}>
                <span>Searching locations...</span>
              </div>
            )}
          </div>
          
          {form.service_areas.length > 0 && (
            <div className="selected-areas" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
              {form.service_areas.map((area, idx) => {
                const areaName = typeof area === 'string' ? area : area.name;
                return (
                  <div
                    key={idx}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#e8f5e9',
                      border: '1px solid #2aa389',
                      borderRadius: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <i className="la la-map-marker" style={{ color: '#2aa389' }}></i>
                    <span style={{ fontWeight: 500 }}>{areaName}</span>
                    <button
                      type="button"
                      onClick={() => removeServiceArea(area)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '18px',
                        color: '#6b7280',
                        padding: '0 4px',
                      }}
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          )}
          
          {form.service_areas.length === 0 && (
            <div style={{
              marginTop: '12px',
              padding: '12px',
              backgroundColor: '#fff3cd',
              border: '1px solid #ffc107',
              borderRadius: '6px',
              fontSize: '13px',
              color: '#856404',
            }}>
              <i className="la la-info-circle" style={{ marginRight: '6px' }}></i>
              Please add at least one service area to let employers know where you work
            </div>
          )}

          {/* Zone Map Preview - Moved here */}
          {zonesLoaded && workingZones.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <ZoneMapPreview zones={workingZones} selectedAreas={form.service_areas} />
            </div>
          )}
        </div>

        <div className="form-group col-lg-12" style={{ marginTop: '24px' }}>
          <button className="theme-btn btn-style-one" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Preferences"}
          </button>
          {error && <span style={{ marginLeft: 12, color: "#b91c1c" }}>{error}</span>}
          {ok && <span style={{ marginLeft: 12, color: "#065f46" }}>{ok}</span>}
        </div>
      </form>
    </div>
  );
}
