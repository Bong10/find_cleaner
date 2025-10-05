"use client";

import { useState } from "react";

const SearchBox = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log("Searching for:", searchTerm);
  };

  return (
    <div className="search-box-one" style={{ marginBottom: '20px' }}>
      <form onSubmit={handleSearch}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 40px 12px 15px',
              border: '1px solid #e8e8e8',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#1967d2'}
            onBlur={(e) => e.target.style.borderColor = '#e8e8e8'}
          />
          <button 
            type="submit"
            style={{
              position: 'absolute',
              right: '5px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              padding: '8px',
              cursor: 'pointer',
              color: '#696969'
            }}
          >
            <i className="la la-search" style={{ fontSize: '18px' }}></i>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBox;
