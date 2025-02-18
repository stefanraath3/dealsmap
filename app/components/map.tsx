"use client";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";
import { deals } from "../data/deals";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

const categories = ["All", "Food", "Shopping", "Fitness"];

const Map = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]);
  const [userLocation, setUserLocation] = useState<{
    lng: number;
    lat: number;
  } | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    const newMap = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [18.4233, -33.9188],
      zoom: 12,
    });

    setMap(newMap);

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setUserLocation({ lng: longitude, lat: latitude });

          newMap.flyTo({
            center: [longitude, latitude],
            zoom: 14,
            essential: true,
          });

          new mapboxgl.Marker({ color: "blue" })
            .setLngLat([longitude, latitude])
            .setPopup(new mapboxgl.Popup().setHTML("<h3>You are here</h3>"))
            .addTo(newMap);
        },
        (error) => console.error("Geolocation error:", error),
        { enableHighAccuracy: true }
      );
    } else {
      console.warn("Geolocation is not supported by this browser.");
    }

    return () => newMap.remove();
  }, []);

  useEffect(() => {
    if (!map) return;

    // Remove old markers
    markers.forEach((marker) => marker.remove());

    // Filter deals based on category
    const filteredDeals =
      selectedCategory === "All"
        ? deals
        : deals.filter((deal) => deal.category === selectedCategory);

    // Add new markers
    const newMarkers = filteredDeals.map((deal) => {
      const marker = new mapboxgl.Marker({ color: "red" })
        .setLngLat([deal.location.lng, deal.location.lat])
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>${deal.name}</h3>`))
        .addTo(map);

      return marker;
    });

    setMarkers(newMarkers);
  }, [selectedCategory, map]);

  return (
    <div className="w-full max-w-[90%] mx-auto">
      {/* Category Filter Buttons */}
      <div className="flex justify-center space-x-4 mb-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-md ${
              selectedCategory === category
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div
        ref={mapContainerRef}
        className="w-full h-[800px] rounded-lg shadow-lg border border-gray-300"
      />
    </div>
  );
};

export default Map;
