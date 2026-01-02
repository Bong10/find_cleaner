"use client";

import { useEffect, useState } from "react";
import { getCleanerMe, patchCleanerMe } from "@/services/cleanerService";
import { fetchServices } from "@/services/jobsService";

export default function ServicePreferences() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [services, setServices] = useState([]);
  
  const [form, setForm] = useState({
    service_types: [],
    service_areas: [],
    availability: {},
  });

  const availabilityDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

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
        
        // Handle both service_types (IDs) and services (Objects) from backend
        let loadedServiceTypes = [];
        if (Array.isArray(data?.service_types) && data.service_types.length > 0) {
          loadedServiceTypes = data.service_types;
        } else if (Array.isArray(data?.services)) {
          loadedServiceTypes = data.services.map(s => s.id);
        }

        setForm({
          service_types: loadedServiceTypes,
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

  const addServiceArea = (area) => {
    if (area && !form.service_areas.includes(area)) {
      setForm(prev => ({
        ...prev,
        service_areas: [...prev.service_areas, area]
      }));
    }
  };

  const removeServiceArea = (area) => {
    setForm(prev => ({
      ...prev,
      service_areas: prev.service_areas.filter(a => a !== area)
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
      setForm({
        service_types: Array.isArray(data?.service_types) ? data.service_types : [],
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
          <label>Service Areas (Cities/Neighborhoods)</label>
          <input
            type="text"
            placeholder="Type a location and press Enter"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addServiceArea(e.target.value.trim());
                e.target.value = '';
              }
            }}
            className="form-control"
            style={{ marginTop: '12px' }}
          />
          <div className="selected-areas" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
            {form.service_areas.map((area, idx) => (
              <div
                key={idx}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>{area}</span>
                <button
                  type="button"
                  onClick={() => removeServiceArea(area)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '18px',
                    color: '#6b7280',
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
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
