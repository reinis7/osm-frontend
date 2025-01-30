import React, { useState } from 'react';
import axios from 'axios'
import './Navbar.scss';
import { useMap } from '../../context/MapContext';

const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export default function Navbar() {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { goToFly } = useMap()
  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchText(query);

    if (query.length > 2) {
      try {
        const data = await axios.get(
          `${VITE_API_URL}/search?location=${query}`
        ).then(res => res.data);
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
    console.log('[location.lon, location.lat]', location)
    goToFly({
      center: [location.lon, location.lat],
      zoom: 12,
    })
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