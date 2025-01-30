import React, { createContext, useContext, useRef, useState, useEffect } from "react";
import maplibregl from 'maplibre-gl';

// Create context
const MapContext = createContext();
const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

// Map provider component
export const MapProvider = ({ children }) => {
    const mapContainerRef = useRef(null);
    const map = useRef(null);
    const [cursorCoords, setCursorCoords] = useState({ lat: 0, lng: 0 });

    const [isLoaded, setIsLoaded] = useState(false);
    const DEFAULT_CENTER = [127, 40];
    const DEFAULT_ZOOM = 5;
    const TILE_SERVER_URL = `${VITE_API_URL}/tiles/styles/basic-preview/style.json`;

    useEffect(() => {
        if (!mapContainerRef.current || map.current) return; // Prevent duplicate initialization

        // Initialize MapLibre GL Map
        map.current = new maplibregl.Map({
            container: mapContainerRef.current,
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
    function goToFly(data) {
        if (!map.current) {
            return ;
        }
        map.current.flyTo(data)

    }

    return (
        <MapContext.Provider value={{ map, isLoaded, cursorCoords, mapContainerRef, goToFly }}>
            {children}
        </MapContext.Provider>
    );
};

// Custom hook for accessing the map context
export const useMap = () => {
    return useContext(MapContext);
};
