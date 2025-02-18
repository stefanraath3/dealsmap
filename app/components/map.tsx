"use client";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef } from "react";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

const Map = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11", // Change theme if needed
      center: [18.4241, -33.9249], // Cape Town
      zoom: 12,
    });

    return () => map.remove();
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <div
        ref={mapContainerRef}
        className="w-full h-[500px] rounded-lg shadow-lg border border-gray-300"
      />
    </div>
  );
};

export default Map;
