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
      const markerElement = document.createElement("div");
      markerElement.className = "marker";
      markerElement.innerHTML = `
        <div class="w-8 h-8 bg-blue-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2">
          <div class="w-2 h-2 bg-white rounded-full"></div>
        </div>
      `;

      const popup = new mapboxgl.Popup({
        offset: 25,
        className: "custom-popup",
      }).setHTML(`
        <div class="p-4 min-w-[200px]">
          <h3 class="font-bold text-gray-900 text-lg mb-1">${deal.name}</h3>
          <span class="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            ${deal.category}
          </span>
        </div>
      `);

      const marker = new mapboxgl.Marker({ element: markerElement })
        .setLngLat([deal.location.lng, deal.location.lat])
        .setPopup(popup)
        .addTo(map);

      return marker;
    });

    setMarkers(newMarkers);
  }, [selectedCategory, map]);

  return (
    <>
      <style jsx global>{`
        .custom-popup .mapboxgl-popup-content {
          padding: 0;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1),
            0 2px 4px -2px rgb(0 0 0 / 0.1);
        }
        .custom-popup .mapboxgl-popup-close-button {
          padding: 6px 10px;
          right: 2px;
          top: 2px;
          color: #4b5563;
          font-size: 20px;
          font-weight: 500;
          border-radius: 50%;
        }
        .custom-popup .mapboxgl-popup-close-button:hover {
          background-color: #f3f4f6;
          color: #1f2937;
        }
      `}</style>
      <div className="w-full max-w-[90%] mx-auto">
        {/* Category Filter Buttons */}
        <div className="flex justify-center space-x-4 mb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 shadow-sm hover:shadow-md ${
                selectedCategory === category
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div
          ref={mapContainerRef}
          className="w-full h-[800px] rounded-xl shadow-lg border border-gray-200 overflow-hidden"
        />
      </div>
    </>
  );
};

export default Map;
