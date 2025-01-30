import React, { useRef, useEffect, useState } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import './MapTiler.scss';
import { useMap } from '../../context/MapContext';


const MapTiler = () => {
    const { mapContainerRef, isLoaded, cursorCoords } = useMap(); // Get the map container reference
   

    return (
        <div className="map-wrap">
            {!isLoaded && <div className="loading">Loading map...</div>}
            <div ref={mapContainerRef} className="map" />
            {/* Cursor Coordinates Display */}
            <div className="coordinate-box">
                <div>Lat: {cursorCoords.lat}°</div>
                <div>Lng: {cursorCoords.lng}°</div>
            </div>
        </div>
    );
};

export default MapTiler;
