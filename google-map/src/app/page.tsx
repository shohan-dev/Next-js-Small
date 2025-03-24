"use client";
import LeafletMap from "@/components/LeafletMap";
import MapComponent from "@/components/map";
import { useState } from "react";



export default function Home() {
  const [map, setMap] = useState("leaflet");
  return (
    <div>

      <div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
          onClick={() => setMap("leaflet")}
        >
          Show Leaflet Map
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setMap("mapComponent")}
        >
          Show Map Component
        </button>
      </div>
      {map === "leaflet" && <LeafletMap />}
      {map === "mapComponent" && <MapComponent />}
    </div>
  );
}
