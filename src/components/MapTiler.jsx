import React, { useRef, useEffect, useState } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import './MapTiler.scss';
import { useMap } from '../../context/MapContext';


const MapTiler = () => {
    const { mapRef, mapContainerRef, isLoaded, cursorCoords, handlePolygon } = useMap(); // Get the map container reference
    const [isDrawing, setIsDrawing] = useState(false);

    // Start drawing when Ctrl is pressed
    const handleKeyDown = (event) => {
        if (event.altKey) {
            setIsDrawing(true);
        }
    };

    // Stop drawing when Ctrl is released
    const handleKeyUp = (event) => {
        if (!event.altKey) setIsDrawing(false);
    };
    const handleMapClick = (event) => {
        if (!isDrawing) return;

        const { lng, lat } = event.lngLat;
        handlePolygon({ lng, lat });

        event.preventDefault();
    };
    console.log('[isDrawing]', isDrawing)




    useEffect(() => {
        if (!mapRef.current) return;

        mapRef.current.on("click", handleMapClick);
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            mapRef.current.off("click", handleMapClick);
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [mapRef.current, isDrawing]);

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
