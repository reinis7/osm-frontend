import React, { createContext, useContext, useRef, useState, useEffect } from "react";
import maplibregl from 'maplibre-gl';

// Create context
const MapContext = createContext();
const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

// Map provider component
export const MapProvider = ({ children }) => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const [cursorCoords, setCursorCoords] = useState({ lat: 0, lng: 0 });

    const [isLoaded, setIsLoaded] = useState(false);
    const DEFAULT_CENTER = [127, 40];
    const DEFAULT_ZOOM = 5;
    const TILE_SERVER_URL = `${VITE_API_URL}/tiles/styles/basic-preview/style.json`;

    const [polygonCoords, setPolygonCoords] = useState([]);
    const [confirmedCoords, setConfirmedCoords] = useState(null);
    const markersRef = useRef([]); // Store references to markers (for index numbers)



    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) return; // Prevent duplicate initialization

        // Initialize MapLibre GL Map
        mapRef.current = new maplibregl.Map({
            container: mapContainerRef.current,
            style: TILE_SERVER_URL,
            center: DEFAULT_CENTER,
            zoom: DEFAULT_ZOOM
        });
        markerRef.current = new maplibregl.Marker().setLngLat([0, 0]).addTo(mapRef.current);

        // Add zoom and rotation controls
        mapRef.current.addControl(new maplibregl.NavigationControl(), 'top-right');

        mapRef.current.on('mousemove', (e) => {
            // console.log('[mousemove]', e.lngLat)
            setCursorCoords({
                lat: e.lngLat.lat.toFixed(6), // Round to 6 decimal places
                lng: e.lngLat.lng.toFixed(6)
            });
        });
        mapRef.current.on("load", () => {
            setIsLoaded(true);
            console.log('Map loaded successfully');

            mapRef.current.addSource("polygonSource", {
                type: "geojson",
                data: {
                    type: "Feature",
                    geometry: {
                        type: "LineString",
                        coordinates: [],
                    },
                },
            });

            mapRef.current.addLayer({
                id: "polygonLayer",
                type: "line",
                source: "polygonSource",
                paint: {
                    "line-color": "red",
                    "line-width": 3,
                },
            });

            // Dashed line for confirmed coordinates
            mapRef.current.addSource("dashedLineSource", {
                type: "geojson",
                data: { type: "Feature", geometry: { type: "LineString", coordinates: [] } },
            });

            mapRef.current.addLayer({
                id: "dashedLineLayer",
                type: "line",
                source: "dashedLineSource",
                paint: {
                    "line-color": "blue",
                    "line-width": 3,
                    "line-dasharray": [4, 2], // Dashed animation effect
                },
            });
        });

        // Resize map on window resize
        window.addEventListener('resize', () => {
            if (mapRef.current) mapRef.current.resize();
        });

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);
    function goToFly(data) {
        if (!mapRef.current) {
            return;
        }
        mapRef.current.flyTo(data)
        const { center } = data;
        markerRef.current.setLngLat(center);
    }
    // Add small index markers to points
    const addIndexMarker = (lng, lat, index) => {
        const marker = new maplibregl.Marker({
            element: createIndexElement(index), // Custom Tailwind-styled element
            anchor: "center",
        })
            .setLngLat([lng, lat])
            .addTo(mapRef.current);

        markersRef.current.push(marker); // Store reference to marker
    };

    // Create a small number marker with Tailwind
    const createIndexElement = (index) => {
        const div = document.createElement("div");
        div.className = "bg-white text-black w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border border-black shadow-md";
        div.innerText = index; // Set the index number
        return div;
    };





    // Update polygon line on the map
    const updatePolygon = (coords) => {
        const source = mapRef.current.getSource("polygonSource");
        if (source) {
            source.setData({
                type: "Feature",
                geometry: {
                    type: "LineString",
                    coordinates: coords,
                },
            });
        }
    };

    const handlePolygon = ({ lng, lat }) => {
        console.log('[handlePolygon]', lng, lat)
        setPolygonCoords((prevCoords) => {
            const updatedCoords = [...prevCoords, [lng, lat]];
            localStorage.setItem("polygon", JSON.stringify(updatedCoords)); // Save to local storage
            updatePolygon(updatedCoords); // Update the map polygon
            addIndexMarker(lng, lat, updatedCoords.length)
            return updatedCoords;
        });
    };
    const handleClear = () => {
        setPolygonCoords([]);
        markersRef.current.forEach((marker) => marker.remove());
        markersRef.current = [];

        const polygonSource = mapRef.current.getSource("polygonSource");
        if (polygonSource) {
            polygonSource.setData({ type: "Feature", geometry: { type: "LineString", coordinates: [] } });
        }

        setConfirmedCoords(null);
    };

    const handleConfirm = () => {
        if (polygonCoords.length < 2) {
            alert("At least two points are needed to confirm!");
            return;
        }
        console.log('[polygonCoords]', polygonCoords)

        // setConfirmedCoords([...polygonCoords]);
        // animateDashedLine([...polygonCoords]);
    };

    // Animate dashed line effect between points
    const animateDashedLine = (coords) => {
        let index = 0;
        const interval = setInterval(() => {
            if (index >= coords.length - 1) {
                clearInterval(interval);
                return;
            }

            const segment = coords.slice(0, index + 2);
            const dashedSource = mapRef.current.getSource("dashedLineSource");
            if (dashedSource) {
                dashedSource.setData({
                    type: "Feature",
                    geometry: {
                        type: "LineString",
                        coordinates: segment,
                    },
                });
            }
            index++;
        }, 500); // Animation speed
    };




    return (
        <MapContext.Provider value={{ mapRef, isLoaded, cursorCoords, mapContainerRef, goToFly, handlePolygon, handleClear, handleConfirm }}>
            {children}
        </MapContext.Provider>
    );
};

// Custom hook for accessing the map context
export const useMap = () => {
    return useContext(MapContext);
};
