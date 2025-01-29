import React, { useState } from 'react';
import './Navbar.scss';

export default function Navbar() {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchText(query);

    if (query.length > 2) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
        );
        const data = await response.json();
        setSearchResults(data);
        console.log('[setSearchResults]', data)
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    } else {
      setSearchResults([]);
    }
  };

  /**
   * Handle selection of a location from search results
   */
  const handleLocationSelect = (location) => {
    setSearchText(location.display_name);
    setSearchResults([]);

    // Move map to the selected location
    // map.current.flyTo({
    //   center: [location.lon, location.lat],
    //   zoom: 12,
    // });
  };
  return (
    <div className="heading">
      <div className="search-box">
        <div>
          <span>Search Location: </span>
          <input
            type="text"
            placeholder="Search location..."
            value={searchText}
            onChange={handleSearch}
          />
        </div>
        {/* Show search suggestions */}
        {searchResults.length > 0 && (
          <ul className="search-results">
            {searchResults.map((location, index) => (
              <li key={index} onClick={() => handleLocationSelect(location)}>
                {location.display_name} ({location.lon}, {location.lat})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}