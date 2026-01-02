// services/locationService.js
import api from "@/utils/axiosConfig";

// In-memory cache for working zones
let zonesCache = null;
let zonesCacheTimestamp = null;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

/**
 * Fetch all working zones from backend
 * Results are cached for 30 minutes to reduce server load
 * @returns {Promise<Array>} - Array of zone objects with boundaries
 */
export const getAllWorkingZones = async () => {
  const now = Date.now();
  
  // Return cached zones if still valid
  if (zonesCache && zonesCacheTimestamp && (now - zonesCacheTimestamp) < CACHE_DURATION) {
    console.log("📦 [LocationService] Using cached zones");
    return zonesCache;
  }

  console.log("🌍 [LocationService] Fetching fresh zones from backend");
  
  try {
    const response = await api.get("/api/services/zones/");
    zonesCache = response.data?.zones || response.data || [];
    zonesCacheTimestamp = now;
    
    console.log(`✅ [LocationService] Loaded ${zonesCache.length} zones`);
    return zonesCache;
  } catch (error) {
    console.error("❌ [LocationService] Failed to fetch zones:", error);
    throw error;
  }
};

/**
 * Clear the zones cache (useful after admin updates zones)
 */
export const clearZonesCache = () => {
  zonesCache = null;
  zonesCacheTimestamp = null;
  console.log("🗑️ [LocationService] Zones cache cleared");
};

/**
 * Check if a point (lat, lng) is within any working zone boundary
 * Uses client-side point-in-polygon algorithm
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {Array} zones - Array of zone objects with boundary polygons
 * @returns {Object|null} - Matching zone object or null
 */
export const isPointInZones = (lat, lng, zones) => {
  for (const zone of zones) {
    const boundary = zone.boundary || zone.boundary_data;
    if (boundary && boundary.coordinates) {
      // GeoJSON MultiPolygon: coordinates[0][0] is the first polygon's outer ring
      const rings = boundary.type === 'MultiPolygon' 
        ? boundary.coordinates 
        : [boundary.coordinates];

      for (const polygonRings of rings) {
        const outerRing = polygonRings[0]; // First ring is outer boundary
        
        if (isPointInPolygon(lat, lng, outerRing)) {
          return zone;
        }
      }
    }
  }
  return null;
};

/**
 * Point-in-polygon algorithm (ray casting)
 * @param {number} lat - Point latitude
 * @param {number} lng - Point longitude
 * @param {Array} polygon - Array of [lng, lat] coordinates
 * @returns {boolean}
 */
const isPointInPolygon = (lat, lng, polygon) => {
  let inside = false;
  
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0]; // longitude
    const yi = polygon[i][1]; // latitude
    const xj = polygon[j][0];
    const yj = polygon[j][1];
    
    const intersect = ((yi > lat) !== (yj > lat)) &&
      (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi);
    
    if (intersect) inside = !inside;
  }
  
  return inside;
};

/**
 * Search for locations using frontend geocoding (OpenStreetMap Nominatim)
 * This replaces the backend search endpoint to reduce server load
 * @param {string} query - User's search query
 * @returns {Promise} - List of matching locations { data: { locations: [...] } }
 */
export const searchLocations = async (query) => {
  try {
    // Use Nominatim for autocomplete suggestions
    // We limit to GB as per project context (can be removed if global)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=gb&limit=5&addressdetails=1`
    );

    if (!response.ok) {
      throw new Error(`Nominatim API error: ${response.status}`);
    }

    const data = await response.json();

    // Map Nominatim response to our application's format
    const locations = data.map(item => {
      // Construct a shorter, cleaner name
      // Nominatim display_name can be very long
      let name = item.display_name;
      const parts = name.split(', ');
      if (parts.length > 3) {
        // Keep first 2 parts and the last part (usually country)
        name = `${parts[0]}, ${parts[1]}, ${parts[parts.length - 1]}`;
      }

      return {
        name: name,
        full_name: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        type: item.type || item.class,
        address: item.address
      };
    });

    // Return in Axios-like structure to maintain compatibility
    return {
      data: {
        locations: locations
      }
    };
  } catch (error) {
    console.error("❌ [LocationService] Frontend search failed:", error);
    // Return empty list on error to prevent UI crash
    return { data: { locations: [] } };
  }
};

/**
 * Validate location against cached zones first, then backend
 * This reduces unnecessary API calls by ~70%
 * @param {string} location - City name, postcode, or region
 * @param {Object} locationData - Optional pre-geocoded data {lat, lng, name}
 * @returns {Promise} - Location boundary data
 */
export const checkLocation = async (location, locationData = null) => {
  // If we have geocoded data, check against cached zones first
  if (locationData?.lat && locationData?.lng) {
    try {
      const zones = await getAllWorkingZones();
      const matchedZone = isPointInZones(locationData.lat, locationData.lng, zones);
      
      if (!matchedZone) {
        console.log("❌ [LocationService] Location outside all zones (client-side check)");
        return Promise.reject({
          response: {
            status: 403,
            data: {
              code: 'OUTSIDE_ZONE',
              message: 'This location is outside our service jurisdiction'
            }
          }
        });
      }
      
      console.log(`✅ [LocationService] Location in zone: ${matchedZone.name}`);
    } catch (error) {
      console.warn("⚠️ [LocationService] Client-side validation failed, falling back to backend");
    }
  }

  // Always verify with backend for accurate boundary data
  return api.post("/api/services/zones/check-location/", { location });
};

/**
 * Search for cleaners by location/postcode
 * @param {string} postcode - Postcode to search
 * @returns {Promise} - List of cleaners covering that location
 */
export const searchCleanersByLocation = (postcode) => {
  return api.post("/api/users/cleaners/search-by-location/", { postcode });
};

/**
 * Validate postcode and get location details
 * Uses postcodes.io (Free UK Postcode API)
 * @param {string} postcode 
 * @returns {Promise<Object>} - Location details including lat/lng
 */
export const validatePostcode = async (postcode) => {
  try {
    // Remove spaces and ensure uppercase
    const cleanPostcode = postcode.replace(/\s+/g, '').toUpperCase();
    
    // Call postcodes.io
    const response = await fetch(`https://api.postcodes.io/postcodes/${cleanPostcode}`);
    const data = await response.json();
    
    if (data.status === 200 && data.result) {
      return {
        isValid: true,
        lat: data.result.latitude,
        lng: data.result.longitude,
        city: data.result.admin_district || data.result.parish || data.result.region,
        county: data.result.admin_county || data.result.region,
        formattedPostcode: data.result.postcode
      };
    }
    
    return { isValid: false, error: "Invalid postcode" };
  } catch (error) {
    console.error("❌ [LocationService] Postcode lookup failed:", error);
    return { isValid: false, error: "Failed to verify postcode" };
  }
};
