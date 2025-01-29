import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './MapTiler.scss';

const MapTiler = () => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [cursorCoords, setCursorCoords] = useState({ lat: 0, lng: 0 });

    // Default map center and zoom (Nagoya, Japan)
    const DEFAULT_CENTER = [136.8905, 35.1485];
    const DEFAULT_ZOOM = 5;

    // Your self-hosted tile server URL
    const TILE_SERVER_URL = 'http://vertextcloudsystems.website:8080/styles/basic-preview/style.json';

    useEffect(() => {
        if (!mapContainer.current || map.current) return; // Prevent duplicate initialization

        // Initialize MapLibre GL Map
        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: TILE_SERVER_URL,
            center: DEFAULT_CENTER,
            zoom: DEFAULT_ZOOM
        });

        // Add zoom and rotation controls
        map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

        map.current.on('load', () => {
            setIsLoaded(true);
            console.log('Map loaded successfully');
        });

        // Capture cursor movement to display lat/lon
        map.current.on('mousemove', (e) => {
            // console.log('[mousemove]', e.lngLat)
            setCursorCoords({
                lat: e.lngLat.lat.toFixed(6), // Round to 6 decimal places
                lng: e.lngLat.lng.toFixed(6)
            });
        });

        // Resize map on window resize
        window.addEventListener('resize', () => {
            if (map.current) map.current.resize();
        });

        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, []);

    return (
        <div className="map-wrap">
            {!isLoaded && <div className="loading">Loading map...</div>}
            <div ref={mapContainer} className="map" />
            {/* Cursor Coordinates Display */}
            <div className="coordinate-box">
                <div>Lat: {cursorCoords.lat}°</div>
                <div>Lng: {cursorCoords.lng}°</div>
            </div>
        </div>
    );
};

export default MapTiler;
