/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from "react-leaflet";
import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

// Fix marker issue
const markerIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const defaultCenter = { lat: 37.7749, lng: -122.4194 }; // Default: San Francisco

function RecenterAutomatically({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center);
    }, [center, map]);
    return null;
}

function CustomControls() {
    const map = useMap();

    return (
        <div className="leaflet-bottom leaflet-right">
            <div className="leaflet-control-container">
                <div className="leaflet-control custom-controls">
                    <button
                        onClick={() => map.setView(defaultCenter, 10)}
                        style={{
                            backgroundColor: "#1a1a1a",
                            color: "white",
                            border: "1px solid #333",
                            padding: "8px 12px",
                            margin: "5px",
                            borderRadius: "4px",
                            cursor: "pointer"
                        }}
                    >
                        Reset View
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function LeafletMap() {
    const [selectedLocation, setSelectedLocation] = useState(defaultCenter);
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState<any[]>([]);

    // Fetch location suggestions (autocomplete)
    async function fetchSuggestions(query: string) {
        if (!query) return setSuggestions([]);
        try {
            const response = await axios.get(
                `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
            );
            setSuggestions(response.data);
        } catch (error) {
            console.error("Error fetching suggestions", error);
        }
    }

    // Search for a location and set marker
    async function searchLocation(place: any = null) {
        let lat: number | null = null;
        let lon: number | null = null;

        try {
            if (place) {
                lat = parseFloat(place.lat);
                lon = parseFloat(place.lon);
            } else if (searchQuery) {
                const response = await axios.get(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                        searchQuery
                    )}`
                );
                if (response.data.length > 0) {
                    lat = parseFloat(response.data[0].lat);
                    lon = parseFloat(response.data[0].lon);
                }
            }

            if (lat && lon) {
                setSelectedLocation({ lat, lng: lon });
                setSuggestions([]);
            }
        } catch (error) {
            console.error("Error fetching location", error);
        }
    }

    return (
        <div style={{
            maxWidth: "800px",
            margin: "auto",
            backgroundColor: "black",
            color: "white",
            padding: "20px",
            minHeight: "100vh"
        }}>
            <style>
                {`
                .leaflet-control-zoom {
                    border: 2px solid rgba(255,255,255,0.2) !important;
                    background: #1a1a1a !important;
                    margin-bottom: 30px !important;
                }

                .leaflet-control-zoom a {
                    background-color: #1a1a1a !important;
                    color: white !important;
                    border-bottom: 1px solid rgba(255,255,255,0.1) !important;
                }

                .leaflet-control-zoom a:hover {
                    background-color: #333 !important;
                }
                `}
            </style>

            {/* Search Input */}
            <div className="mb-2" style={{ position: "relative" }}>
                <input
                    type="text"
                    placeholder="Search location..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        fetchSuggestions(e.target.value);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") searchLocation();
                    }}
                    style={{
                        padding: "10px",
                        width: "100%",
                        border: "1px solid #333",
                        borderRadius: "4px",
                        backgroundColor: "#1a1a1a",
                        color: "white",
                        outline: "none"
                    }}
                />

                {/* Suggestions List */}
                {suggestions.length > 0 && (
                    <ul
                        style={{
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            width: "100%",
                            background: "#1a1a1a",
                            border: "1px solid #333",
                            borderRadius: "4px",
                            maxHeight: "200px",
                            overflowY: "auto",
                            listStyle: "none",
                            padding: "0",
                            margin: "5px 0 0 0",
                            zIndex: 1000,
                        }}
                    >
                        {suggestions.map((place: any, index: number) => (
                            <li
                                key={index}
                                onClick={() => {
                                    searchLocation(place);
                                    setSearchQuery(place.display_name);
                                }}
                                style={{
                                    padding: "10px",
                                    cursor: "pointer",
                                    borderBottom: "1px solid #333",
                                    color: "white",
                                    backgroundColor: "#1a1a1a",
                                    transition: "background-color 0.2s"
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "#333";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "#1a1a1a";
                                }}
                            >
                                {place.display_name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Map Display */}
            <div style={{ borderRadius: "8px", overflow: "hidden" }}>
                <MapContainer
                    center={selectedLocation}
                    zoom={10}
                    style={{ height: "500px", width: "100%" }}
                    zoomControl={false}
                >
                    <RecenterAutomatically center={[selectedLocation.lat, selectedLocation.lng]} />
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <ZoomControl position="bottomleft" />
                    <CustomControls />
                    <Marker position={selectedLocation} icon={markerIcon}>
                        <Popup>Selected Location</Popup>
                    </Marker>
                </MapContainer>
            </div>

            {/* Selected Coordinates */}
            {selectedLocation && (
                <p style={{
                    marginTop: "15px",
                    padding: "10px",
                    backgroundColor: "#1a1a1a",
                    borderRadius: "4px",
                    textAlign: "center"
                }}>
                    <strong>Selected Location:</strong> {selectedLocation.lat.toFixed(6)},{" "}
                    {selectedLocation.lng.toFixed(6)}
                </p>
            )}
        </div>
    );
}