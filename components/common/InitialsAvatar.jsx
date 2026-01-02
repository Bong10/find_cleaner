"use client";

/**
 * InitialsAvatar - Generates an avatar with user initials
 * @param {Object} props
 * @param {string} props.name - Full name of the user
 * @param {string} props.src - Optional profile picture URL
 * @param {number} props.size - Avatar size in pixels (default: 50)
 * @param {string} props.className - Optional CSS class
 * @param {Object} props.style - Optional inline styles
 */
export default function InitialsAvatar({ 
  name = "", 
  src = null, 
  size = 50, 
  className = "",
  style = {} 
}) {
  // Generate initials from name
  const getInitials = (fullName) => {
    if (!fullName || fullName.trim() === "") return "U";
    
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) {
      // Single name - take first 2 characters
      return parts[0].substring(0, 2).toUpperCase();
    }
    
    // Multiple names - take first letter of first and last name
    const firstInitial = parts[0].charAt(0).toUpperCase();
    const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();
    return firstInitial + lastInitial;
  };

  // Generate consistent color from name
  const getColorFromName = (fullName) => {
    if (!fullName) return "#1967d2"; // Default blue
    
    // Hash the name to get a consistent number
    let hash = 0;
    for (let i = 0; i < fullName.length; i++) {
      hash = fullName.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Generate pastel colors (lighter, more pleasant)
    const colors = [
      "#1967d2", // Blue
      "#34a853", // Green
      "#ea4335", // Red
      "#fbbc04", // Yellow
      "#9334e6", // Purple
      "#ec4899", // Pink
      "#14b8a6", // Teal
      "#f97316", // Orange
      "#6366f1", // Indigo
      "#84cc16", // Lime
    ];
    
    return colors[Math.abs(hash) % colors.length];
  };

  const initials = getInitials(name);
  const bgColor = getColorFromName(name);

  // If there's a valid profile picture, show it
  if (src) {
    return (
      <img
        src={src}
        alt={name || "Profile"}
        className={className}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          ...style,
        }}
        onError={(e) => {
          // If image fails to load, replace with initials
          e.currentTarget.style.display = "none";
          const parent = e.currentTarget.parentElement;
          if (parent) {
            parent.innerHTML = `
              <div style="
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background-color: ${bgColor};
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 600;
                font-size: ${size * 0.4}px;
                text-transform: uppercase;
                user-select: none;
              ">${initials}</div>
            `;
          }
        }}
      />
    );
  }

  // Show initials avatar
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: bgColor,
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 600,
        fontSize: size * 0.4,
        textTransform: "uppercase",
        userSelect: "none",
        ...style,
      }}
    >
      {initials}
    </div>
  );
}
