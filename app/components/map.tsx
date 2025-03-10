"use client";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";
import { Deal } from "../data/deals";
import DealCard from "./DealCard";
import DealCardSkeleton from "./DealCardSkeleton";

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
  filters: {
    price: string;
    dealType: string;
    dayOfWeek: string;
    timeOfDay: string;
  };
}

const Map = ({
  showMap,
  setShowMap,
  selectedCategory,
  setSelectedCategory,
  setUserLocation,
  filters,
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
  const [selectedMarkerElement, setSelectedMarkerElement] =
    useState<HTMLElement | null>(null);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await fetch("/api/deals");
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          console.error("API error response:", errorData);
          throw new Error(
            errorData?.message || `Failed to fetch deals: ${response.status}`
          );
        }
        const data = await response.json();
        console.log(`Successfully loaded ${data.length} deals`);
        setDeals(data);
      } catch (error) {
        console.error("Error fetching deals:", error);
        // Set error state but don't stop the app from rendering
        setDeals([]);
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

  const filterDeals = (deals: Deal[]) => {
    return deals.filter((deal) => {
      // Filter by price
      if (filters.price !== "Any price") {
        const price = deal.price ? parseFloat(deal.price) : 0;
        switch (filters.price) {
          case "Under R50":
            if (price >= 50) return false;
            break;
          case "R50 - R100":
            if (price < 50 || price > 100) return false;
            break;
          case "R100 - R200":
            if (price < 100 || price > 200) return false;
            break;
          case "R200+":
            if (price <= 200) return false;
            break;
        }
      }

      // Filter by deal type
      if (
        filters.dealType !== "All deals" &&
        deal.category !== filters.dealType
      ) {
        return false;
      }

      // Filter by day of week
      if (filters.dayOfWeek !== "Any day") {
        if (deal.day !== filters.dayOfWeek && deal.day !== "Every day") {
          return false;
        }
      }

      // Filter by time of day
      if (filters.timeOfDay !== "Any time" && deal.timeWindow) {
        const timeWindow = deal.timeWindow.toLowerCase();
        switch (filters.timeOfDay) {
          case "Morning (6AM-12PM)":
            if (!timeWindow.includes("am") && !timeWindow.includes("morning"))
              return false;
            break;
          case "Afternoon (12PM-5PM)":
            if (!timeWindow.includes("pm") && !timeWindow.includes("afternoon"))
              return false;
            break;
          case "Evening (5PM-10PM)":
            if (!timeWindow.includes("evening") && !timeWindow.match(/[5-9]pm/))
              return false;
            break;
          case "Late Night (10PM-6AM)":
            if (
              !timeWindow.includes("night") &&
              !timeWindow.match(/1[0-2]pm|[1-6]am/)
            )
              return false;
            break;
        }
      }

      return true;
    });
  };

  useEffect(() => {
    if (!map || loading || !showMap) return;

    // Remove old markers
    Object.values(markers).forEach((marker) => marker.remove());
    setActivePopup(null);

    // Filter deals based on category and other filters
    const filteredByCategory =
      selectedCategory === "All"
        ? deals
        : deals.filter((deal) => deal.category === selectedCategory);

    // Apply additional filters
    const fullyFilteredDeals = filterDeals(filteredByCategory);

    // Add new markers
    const addMarkers = () => {
      const newMarkers: Record<number, mapboxgl.Marker> = {};

      for (const deal of fullyFilteredDeals) {
        const lng = parseFloat(deal.longitude);
        const lat = parseFloat(deal.latitude);

        const markerElement = document.createElement("div");
        markerElement.className =
          "marker cursor-pointer transform transition-all duration-200 hover:scale-110";
        markerElement.innerHTML = `
          <div class="px-3 py-1.5 rounded-full bg-white shadow-lg border border-gray-100 font-medium text-sm whitespace-nowrap text-gray-900 hover:border-gray-300 transition-all">
            R${deal.price || "0"}
          </div>
        `;

        const marker = new mapboxgl.Marker({ element: markerElement })
          .setLngLat([lng, lat])
          .addTo(map);

        marker.getElement().addEventListener("click", (e) => {
          // Reset previous selected marker
          if (selectedMarkerElement) {
            selectedMarkerElement.classList.remove("selected");
          }

          // Update selected marker
          markerElement.classList.add("selected");
          setSelectedMarkerElement(markerElement);

          setSelectedDeal(deal);

          // Calculate optimal position to show both marker and card
          const markerPos = map.project([lng, lat]);
          const optimalLng =
            lng + (markerPos.x > window.innerWidth / 2 ? -0.002 : 0.002);

          map.flyTo({
            center: [optimalLng, lat],
            zoom: 15,
            essential: true,
            duration: 800,
          });

          e.stopPropagation();
        });

        newMarkers[deal.id] = marker;
      }

      setMarkers(newMarkers);
    };

    // Clear selected deal when clicking on the map
    map.on("click", () => {
      setSelectedDeal(null);
      if (selectedMarkerElement) {
        selectedMarkerElement.classList.remove("selected");
        setSelectedMarkerElement(null);
      }
    });

    addMarkers();
  }, [selectedCategory, map, deals, loading, showMap, filters]);

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
        .marker {
          transform-origin: bottom center;
        }
        .marker.selected > div {
          background-color: #111827;
          color: white;
          border-color: #111827;
          transform: scale(1.1);
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1),
            0 4px 6px -4px rgb(0 0 0 / 0.1);
        }
      `}</style>
      <div
        data-map-component
        className={`flex flex-col w-full min-h-screen ${
          showMap ? "pt-12" : "pt-[96px]"
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
                <>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <DealCardSkeleton key={i} />
                  ))}
                </>
              ) : (
                filterDeals(
                  selectedCategory === "All"
                    ? deals
                    : deals.filter((deal) => deal.category === selectedCategory)
                ).map((deal) => <DealCard key={deal.id} deal={deal} />)
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
              <div
                className="fixed left-1/2 transform -translate-x-1/2 z-10 w-full max-w-sm transition-all duration-300"
                style={{
                  bottom: "2rem",
                }}
              >
                <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDeal(null);
                      if (selectedMarkerElement) {
                        selectedMarkerElement.classList.remove("selected");
                        setSelectedMarkerElement(null);
                      }
                    }}
                    className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <div className="p-4">
                    <DealCard deal={selectedDeal} />
                  </div>
                </div>
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
