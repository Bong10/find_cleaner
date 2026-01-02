"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Simple zone boundary visualization
 * Shows working zones as colored polygons on a basic map
 * This is a lightweight preview - for full interactive maps, use Leaflet/Mapbox
 */
export default function ZoneMapPreview({ zones, selectedAreas = [] }) {
  const canvasRef = useRef(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    if (!showMap || !zones || zones.length === 0 || !canvasRef.current) return;

    console.log("🗺️ [ZoneMapPreview] Rendering zones:", zones.length);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#f3f4f6";
    ctx.fillRect(0, 0, width, height);

    // Calculate bounds of all zones
    let minLat = Infinity, maxLat = -Infinity;
    let minLng = Infinity, maxLng = -Infinity;
    let hasValidCoords = false;

    zones.forEach((zone, index) => {
      console.log(`🔍 [ZoneMapPreview] Inspecting zone ${index}:`, zone);

      // Try to find the geometry object
      let boundary = zone.boundary || zone.boundary_data || zone.geometry || zone.geom;
      
      // If zone itself looks like a geometry
      if (!boundary && zone.coordinates && zone.type) {
        boundary = zone;
      }

      // Handle stringified boundary
      if (typeof boundary === 'string') {
        try {
          boundary = JSON.parse(boundary);
        } catch (e) {
          console.error("Failed to parse boundary JSON:", e);
          return;
        }
      }

      if (!boundary?.coordinates) {
        console.warn(`⚠️ [ZoneMapPreview] Zone ${index} (${zone.name}) missing coordinates. Keys:`, Object.keys(zone));
        return;
      }

      // Determine nesting level to flatten correctly
      // GeoJSON:
      // Point: [x, y] (depth 0 array of numbers)
      // LineString: [[x, y], ...] (depth 1 array of arrays)
      // Polygon: [[[x, y], ...], ...] (depth 2)
      // MultiPolygon: [[[[x, y], ...], ...], ...] (depth 3)
      
      const coords = boundary.type === 'MultiPolygon'
        ? boundary.coordinates.flat(2)
        : (boundary.type === 'Polygon' ? boundary.coordinates.flat(1) : []);

      if (coords.length === 0) {
        console.warn(`⚠️ [ZoneMapPreview] Zone ${index} has empty coordinates or unknown type: ${boundary.type}`);
        return;
      }

      coords.forEach((point) => {
        // Ensure point is [lng, lat]
        if (!Array.isArray(point) || point.length < 2) return;
        
        const lng = Number(point[0]);
        const lat = Number(point[1]);

        if (isNaN(lat) || isNaN(lng)) return;

        hasValidCoords = true;
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
        if (lng < minLng) minLng = lng;
        if (lng > maxLng) maxLng = lng;
      });
    });

    if (!hasValidCoords) {
      console.warn("⚠️ [ZoneMapPreview] No valid coordinates found in zones");
      ctx.fillStyle = "#9ca3af";
      ctx.font = "14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("No valid map data available", width / 2, height / 2);
      return;
    }

    console.log(`🗺️ [ZoneMapPreview] Bounds: Lat[${minLat}, ${maxLat}], Lng[${minLng}, ${maxLng}]`);

    // Add padding (handle zero-size bounds)
    let latRange = maxLat - minLat;
    let lngRange = maxLng - minLng;
    
    if (latRange === 0) latRange = 0.01;
    if (lngRange === 0) lngRange = 0.01;

    const latPadding = latRange * 0.1;
    const lngPadding = lngRange * 0.1;
    
    minLat -= latPadding;
    maxLat += latPadding;
    minLng -= lngPadding;
    maxLng += lngPadding;

    // Recalculate range with padding
    const finalLatRange = maxLat - minLat;
    const finalLngRange = maxLng - minLng;

    // Convert lat/lng to canvas coordinates
    const latToY = (lat) => height - ((lat - minLat) / finalLatRange) * height;
    const lngToX = (lng) => ((lng - minLng) / finalLngRange) * width;

    // Draw zones
    zones.forEach((zone, idx) => {
      let boundary = zone.boundary || zone.boundary_data || zone.geometry || zone.geom;
      if (!boundary && zone.coordinates && zone.type) boundary = zone;

      if (typeof boundary === 'string') {
        try { boundary = JSON.parse(boundary); } catch (e) {}
      }

      if (!boundary?.coordinates) return;

      // Normalize to MultiPolygon structure for consistent drawing
      // Polygon: [[[x,y], ...]] (1 ring)
      // MultiPolygon: [[[[x,y], ...]], ...] (array of polygons)
      const polygons = boundary.type === 'MultiPolygon'
        ? boundary.coordinates
        : [boundary.coordinates]; // Treat Polygon as MultiPolygon with 1 polygon

      polygons.forEach(polygonRings => {
        // polygonRings is array of rings: [outerRing, hole1, hole2...]
        // We only draw the outer ring (index 0) for simplicity
        const outerRing = Array.isArray(polygonRings[0]) && Array.isArray(polygonRings[0][0]) 
          ? polygonRings[0] // It was already nested correctly
          : polygonRings;   // It was a simple polygon ring

        // Safety check: outerRing should be array of points
        if (!Array.isArray(outerRing)) return;

        // Check if this zone contains any selected areas
        const isHighlighted = selectedAreas.some(area => 
          area.zone_id === zone.id || area.name?.includes(zone.name)
        );

        // Draw polygon
        ctx.beginPath();
        let firstPoint = true;
        
        outerRing.forEach((point) => {
          if (!Array.isArray(point) || point.length < 2) return;
          
          const lng = Number(point[0]);
          const lat = Number(point[1]);
          
          if (isNaN(lat) || isNaN(lng)) return;

          const x = lngToX(lng);
          const y = latToY(lat);
          
          if (firstPoint) {
            ctx.moveTo(x, y);
            firstPoint = false;
          } else {
            ctx.lineTo(x, y);
          }
        });
        ctx.closePath();

        // Fill
        ctx.fillStyle = isHighlighted 
          ? 'rgba(42, 163, 137, 0.3)' // Primary color with transparency
          : 'rgba(99, 102, 241, 0.15)'; // Light blue
        ctx.fill();

        // Stroke
        ctx.strokeStyle = isHighlighted ? '#2aa389' : '#6366f1';
        ctx.lineWidth = isHighlighted ? 2 : 1;
        ctx.stroke();
      });

      // Add zone label at center
      if (boundary?.coordinates) {
        const ring = boundary.type === 'MultiPolygon'
          ? boundary.coordinates[0][0]
          : boundary.coordinates[0];

        // Calculate centroid (simple average)
        let sumLat = 0, sumLng = 0, count = 0;
        ring.forEach((point) => {
          const lng = Number(point[0]);
          const lat = Number(point[1]);
          if (!isNaN(lat) && !isNaN(lng)) {
            sumLat += lat;
            sumLng += lng;
            count++;
          }
        });
        
        if (count > 0) {
          const centerLat = sumLat / count;
          const centerLng = sumLng / count;

          const x = lngToX(centerLng);
          const y = latToY(centerLat);

          ctx.fillStyle = '#1f2937';
          ctx.font = '12px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(zone.name || `Zone ${idx + 1}`, x, y);
        }
      }
    });

    // Draw selected locations as markers
    selectedAreas.forEach(area => {
      // Handle both object with lat/lng and simple string (skip string)
      if (area && typeof area === 'object' && (area.lat || area.latitude) && (area.lng || area.longitude)) {
        const lat = Number(area.lat || area.latitude);
        const lng = Number(area.lng || area.longitude);

        if (!isNaN(lat) && !isNaN(lng)) {
          const x = lngToX(lng);
          const y = latToY(lat);

          // Draw pin/dot
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, 2 * Math.PI);
          ctx.fillStyle = '#ef4444'; // Red
          ctx.fill();
          ctx.strokeStyle = 'white';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Draw label
          ctx.fillStyle = '#111827';
          ctx.font = 'bold 11px sans-serif';
          ctx.textAlign = 'center';
          // Offset label slightly above the dot
          ctx.fillText(area.name || 'Location', x, y - 8);
        }
      }
    });

  }, [zones, selectedAreas, showMap]);

  if (!zones || zones.length === 0) {
    return (
      <div style={{
        padding: '24px',
        textAlign: 'center',
        color: '#6b7280',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        border: '1px dashed #d1d5db'
      }}>
        <p>No working zones available</p>
      </div>
    );
  }

  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      overflow: 'hidden',
      backgroundColor: 'white'
    }}>
      <div 
        onClick={() => setShowMap(!showMap)}
        style={{
          padding: '12px 16px',
          backgroundColor: '#f9fafb',
          borderBottom: showMap ? '1px solid #e5e7eb' : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          userSelect: 'none'
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>🗺️</span>
          <span style={{ fontWeight: 500, color: '#111827' }}>Working Zones Map</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: '#6b7280' }}>
            {zones.length} zone{zones.length !== 1 ? 's' : ''} loaded
          </span>
          <button 
            type="button"
            onClick={() => setShowMap(!showMap)}
            style={{ 
              fontSize: '12px', 
              color: '#2aa389', 
              fontWeight: 500,
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {showMap ? 'Hide Map' : 'Show Preview'}
          </button>
        </div>
      </div>
      
      {showMap && (
        <>
          <canvas
            ref={canvasRef}
            width={600}
            height={300}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block'
            }}
          />
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#f9fafb',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            gap: '16px',
            fontSize: '13px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '16px',
                height: '16px',
                backgroundColor: 'rgba(42, 163, 137, 0.3)',
                border: '2px solid #2aa389',
                borderRadius: '3px'
              }}></div>
              <span style={{ color: '#6b7280' }}>Your service areas</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '16px',
                height: '16px',
                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid #6366f1',
                borderRadius: '3px'
              }}></div>
              <span style={{ color: '#6b7280' }}>Available zones</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
