"use client";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef } from "react";
import { Deal, deals } from "../data/deals";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

const Map = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11", // Change theme if needed
      center: [18.4233, -33.9188], // Cape Town
      zoom: 12,
    });

    // Add markers for each deal
    deals.forEach((deal: Deal) => {
      const marker = new mapboxgl.Marker({ color: "red" })
        .setLngLat([deal.location.lng, deal.location.lat])
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>${deal.name}</h3>`))
        .addTo(map);
    });

    return () => map.remove();
  }, []);

  return (
    <div className="w-full max-w-[90%] mx-auto">
      <div
        ref={mapContainerRef}
        className="w-full h-[800px] rounded-lg shadow-lg border border-gray-300"
      />
    </div>
  );
};

export default Map;
