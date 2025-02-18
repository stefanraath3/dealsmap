"use client";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";
import { deals } from "../data/deals";
import SearchBar from "./search-bar";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

const categories = ["All", "Food", "Shopping", "Fitness"];

const categoryConfig = {
  Food: {
    color: "#EF4444", // red-500
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="white" stroke="white"><path d="M11 3V11H3V13H11V21H13V13H21V11H13V3H11Z"/></svg>`,
  },
  Shopping: {
    color: "#8B5CF6", // violet-500
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="white" stroke="white"><path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12z"/></svg>`,
  },
  Fitness: {
    color: "#10B981", // emerald-500
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="white" stroke="white"><path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/></svg>`,
  },
};

const Map = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]);
  const [userLocation, setUserLocation] = useState<{
    lng: number;
    lat: number;
  } | null>(null);
  const [searchMarker, setSearchMarker] = useState<mapboxgl.Marker | null>(
    null
  );

  useEffect(() => {
    if (!mapContainerRef.current) return;
    const newMap = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [18.4233, -33.9188],
      zoom: 12,
    });

    setMap(newMap);
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
      const config =
        categoryConfig[deal.category as keyof typeof categoryConfig];
      const markerElement = document.createElement("div");
      markerElement.className = "marker";
      markerElement.innerHTML = `
        <div class="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2"
             style="background-color: ${config?.color || "#3B82F6"}">
          ${config?.icon || ""}
        </div>
      `;

      const popup = new mapboxgl.Popup({
        offset: 25,
        className: "custom-popup",
      }).setHTML(`
        <div class="p-4 min-w-[200px]">
          <h3 class="font-bold text-gray-900 text-lg mb-1">${deal.name}</h3>
          <span class="inline-block px-2 py-1 rounded-full text-sm font-medium" 
                style="background-color: ${config?.color}20; color: ${config?.color}">
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

  const handleSearch = async (query: string) => {
    if (!map) return;

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?access_token=${mapboxgl.accessToken}`
      );

      if (!response.ok) throw new Error("Search failed");

      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;

        // Remove existing search marker
        searchMarker?.remove();

        // Add new marker
        const newMarker = new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .setPopup(
            new mapboxgl.Popup().setHTML(
              `<h3>${data.features[0].place_name}</h3>`
            )
          )
          .addTo(map);

        setSearchMarker(newMarker);

        // Animate to the location
        map.flyTo({
          center: [lng, lat],
          zoom: 14,
          essential: true,
        });
      }
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleGetLocation = () => {
    if (!map || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        setUserLocation({ lng: longitude, lat: latitude });

        map.flyTo({
          center: [longitude, latitude],
          zoom: 14,
          essential: true,
        });

        // Remove existing user location marker if it exists
        if (userLocation) {
          const existingMarkers = document.querySelectorAll(
            ".user-location-marker"
          );
          existingMarkers.forEach((marker) => marker.remove());
        }

        // Create marker element
        const markerElement = document.createElement("div");
        markerElement.className = "user-location-marker";
        markerElement.innerHTML = `
          <div class="w-8 h-8 rounded-full bg-blue-500 border-2 border-white shadow-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
            </svg>
          </div>
        `;

        new mapboxgl.Marker({ element: markerElement })
          .setLngLat([longitude, latitude])
          .setPopup(new mapboxgl.Popup().setHTML("<h3>You are here</h3>"))
          .addTo(map);
      },
      (error) => console.error("Geolocation error:", error),
      { enableHighAccuracy: true }
    );
  };

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
        .mapboxgl-ctrl-group {
          background: white !important;
          border-radius: 8px !important;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
        }
        .mapboxgl-ctrl-group button {
          width: 40px !important;
          height: 40px !important;
        }
        .mapboxgl-ctrl-group button:hover {
          background-color: #f3f4f6 !important;
        }
      `}</style>
      <div className="flex flex-col w-full max-w-[90%] mx-auto gap-6">
        {/* Search bar */}
        <SearchBar onSearch={handleSearch} />

        <div className="flex w-full gap-6">
          {/* Sidebar */}
          <div className="w-1/3 bg-white p-4 rounded-xl shadow-lg h-[800px] overflow-y-auto border border-gray-200">
            <h2 className="text-xl font-bold mb-4 text-gray-900">
              Available Deals
            </h2>

            {/* Category Filter Buttons */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-1.5 rounded-full font-medium transition-all duration-200 text-sm ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Deal Listings */}
            <div className="space-y-3">
              {(selectedCategory === "All"
                ? deals
                : deals.filter((deal) => deal.category === selectedCategory)
              ).map((deal) => (
                <div
                  key={deal.id}
                  onClick={() => {
                    map?.flyTo({
                      center: [deal.location.lng, deal.location.lat],
                      zoom: 15,
                      duration: 1500,
                    });
                  }}
                  className="p-4 rounded-lg border border-gray-100 hover:border-gray-200 bg-white hover:bg-gray-50 cursor-pointer transition-all duration-200 shadow-sm hover:shadow"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {deal.name}
                  </h3>
                  <span className="inline-block px-2.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {deal.category}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Map Container */}
          <div className="flex-1 relative">
            <div
              ref={mapContainerRef}
              className="w-full h-[800px] rounded-xl shadow-lg border border-gray-200 overflow-hidden"
            />
            {/* Location Button */}
            <button
              onClick={handleGetLocation}
              className="absolute bottom-6 right-6 p-3 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 focus:outline-none"
              title="Get your location"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Map;
