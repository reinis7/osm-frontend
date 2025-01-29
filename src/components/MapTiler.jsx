import React, { useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './MapTiler.scss';

const MapTiler = () => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    
    // Default map center and zoom
    const lng = 136.8905;
    const lat = 35.1485;
    const zoom = 5;

    // Your self-hosted tile server URL
    const TILE_SERVER_URL = 'http://vertextcloudsystems.website:8080/styles/basic-preview/style.json';

    useEffect(() => {
        if (map.current) return; // Prevent multiple initializations

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: TILE_SERVER_URL, // Use self-hosted style
            center: [lng, lat],
            zoom: zoom
        });

    }, [TILE_SERVER_URL, lng, lat, zoom]);

    return (
        <div className="map-wrap">
            <div ref={mapContainer} className="map" />
        </div>
    );
};

export default MapTiler;
