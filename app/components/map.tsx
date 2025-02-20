"use client";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";
import { Deal } from "../data/deals";
import DealCard from "./DealCard";

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

interface MapProps {
  showMap: boolean;
  setShowMap: (show: boolean) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  setUserLocation: (location: { lng: number; lat: number } | null) => void;
}

const Map = ({
  showMap,
  setShowMap,
  selectedCategory,
  setSelectedCategory,
  setUserLocation,
}: MapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [markers, setMarkers] = useState<Record<number, mapboxgl.Marker>>({});
  const [searchMarker, setSearchMarker] = useState<mapboxgl.Marker | null>(
    null
  );
  const [activePopup, setActivePopup] = useState<number | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await fetch("/api/deals");
        if (!response.ok) throw new Error("Failed to fetch deals");
        const data = await response.json();
        setDeals(data);
      } catch (error) {
        console.error("Error fetching deals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || !showMap) return;
    const newMap = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [18.4241, -33.9249], // Cape Town city center
      zoom: 13,
    });

    setMap(newMap);
    return () => newMap.remove();
  }, [showMap]);

  useEffect(() => {
    if (!map || loading || !showMap) return;

    // Remove old markers
    Object.values(markers).forEach((marker) => marker.remove());
    setActivePopup(null);

    // Filter deals based on category
    const filteredDeals =
      selectedCategory === "All"
        ? deals
        : deals.filter((deal) => deal.category === selectedCategory);

    // Add new markers
    const addMarkers = () => {
      const newMarkers: Record<number, mapboxgl.Marker> = {};

      for (const deal of filteredDeals) {
        const config =
          categoryConfig[deal.category as keyof typeof categoryConfig];

        const lng = parseFloat(deal.longitude);
        const lat = parseFloat(deal.latitude);

        const markerElement = document.createElement("div");
        markerElement.className = "marker";
        markerElement.innerHTML = `
          <div class="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2"
               style="background-color: ${config?.color || "#3B82F6"}">
            ${config?.icon || ""}
          </div>
        `;

        const marker = new mapboxgl.Marker({ element: markerElement })
          .setLngLat([lng, lat])
          .addTo(map);

        marker.getElement().addEventListener("click", () => {
          setSelectedDeal(deal);
          map.flyTo({
            center: [lng, lat],
            zoom: 15,
            essential: true,
          });
        });

        newMarkers[deal.id] = marker;
      }

      setMarkers(newMarkers);
    };

    addMarkers();
  }, [selectedCategory, map, deals, loading, showMap]);

  const handleSearch = async (query: string) => {
    if (!map || !showMap) return;

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
    if (!map || !navigator.geolocation || !showMap) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        const location = { lng: longitude, lat: latitude };
        setUserLocation(location);

        map.flyTo({
          center: [longitude, latitude],
          zoom: 14,
          essential: true,
        });

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

  const filteredDeals =
    selectedCategory === "All"
      ? deals
      : deals.filter((deal) => deal.category === selectedCategory);

  return (
    <>
      <style jsx global>{`
        .mapboxgl-popup-content {
          padding: 0;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1),
            0 2px 4px -2px rgb(0 0 0 / 0.1);
        }
        .mapboxgl-popup-close-button {
          padding: 6px 10px;
          right: 2px;
          top: 2px;
          color: #4b5563;
          font-size: 20px;
          font-weight: 500;
          border-radius: 50%;
        }
        .mapboxgl-popup-close-button:hover {
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
      <div
        data-map-component
        className={`flex flex-col w-full min-h-screen ${
          showMap ? "pt-16" : "pt-[120px]"
        }`}
      >
        {/* Main content */}
        <div className="relative flex-1">
          {/* Grid view */}
          <div
            className={`transition-all duration-300 ${
              showMap ? "hidden" : "block px-4 sm:px-6 lg:px-8"
            }`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-6">
              {loading ? (
                <div className="text-gray-600">Loading deals...</div>
              ) : (
                filteredDeals.map((deal) => (
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    onClick={() => {
                      setShowMap(true);
                      setSelectedDeal(deal);
                      const marker = markers[deal.id];
                      if (marker && map) {
                        const [lng, lat] = marker.getLngLat().toArray();
                        map.flyTo({
                          center: [lng, lat],
                          zoom: 15,
                          essential: true,
                        });
                      }
                    }}
                  />
                ))
              )}
            </div>
          </div>

          {/* Map view */}
          <div
            className={`absolute inset-0 transition-all duration-300 ${
              showMap
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <div
              ref={mapContainerRef}
              className="w-full h-full overflow-hidden"
            />

            {/* Selected deal card */}
            {selectedDeal && showMap && (
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-full max-w-lg px-4">
                <DealCard
                  deal={selectedDeal}
                  onClick={() => setSelectedDeal(null)}
                />
              </div>
            )}

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

          {/* Toggle button */}
          <button
            onClick={() => setShowMap(!showMap)}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-gray-900 text-white rounded-full font-medium shadow-lg hover:bg-gray-800 transition-colors duration-200"
          >
            {showMap ? "Show list" : "Show map"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Map;
