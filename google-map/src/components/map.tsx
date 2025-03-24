"use client";
import { GoogleMap, Marker, useLoadScript, Autocomplete } from "@react-google-maps/api";
import { useState, useCallback, useRef } from "react";

const libraries: ("places")[] = ["places"]; // Required for search
const mapContainerStyle = { width: "100%", height: "500px" };
const defaultCenter = { lat: 37.7749, lng: -122.4194 }; // San Francisco

export default function MapComponent() {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        libraries,
    });

    const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

    // Handle map click to place marker
    const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
            setSelectedLocation({ lat: event.latLng.lat(), lng: event.latLng.lng() });
        }
    }, []);

    // Handle search box selection
    const handlePlaceSelect = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            if (place?.geometry?.location) {
                setSelectedLocation({
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                });
            }
        }
    };

    if (loadError) return <p>Error loading maps</p>;
    if (!isLoaded) return <p>Loading Maps...</p>;

    return (
        <div>
            {/* Search Location Input */}
            <Autocomplete
                onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                onPlaceChanged={handlePlaceSelect}
            >
                <input
                    type="text"
                    placeholder="Search location..."
                    className="w-full p-2 mb-3 border rounded"
                />
            </Autocomplete>

            {/* Google Map */}
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={10}
                center={selectedLocation || defaultCenter}
                onClick={handleMapClick}
            >
                {selectedLocation && <Marker position={selectedLocation} />}
            </GoogleMap>

            {/* Selected Location Info */}
            {selectedLocation && (
                <p className="mt-2">Selected Location: {selectedLocation.lat}, {selectedLocation.lng}</p>
            )}
        </div>
    );
}
