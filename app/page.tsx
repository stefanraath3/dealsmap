"use client";

import { useState } from "react";
import Header from "./components/header";
import Map from "./components/map";

interface Filters {
  price: string;
  dealType: string;
  dayOfWeek: string;
  timeOfDay: string;
}

export default function Home() {
  const [showMap, setShowMap] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [userLocation, setUserLocation] = useState<{
    lng: number;
    lat: number;
  } | null>(null);
  const [filters, setFilters] = useState<Filters>({
    price: "Any price",
    dealType: "All deals",
    dayOfWeek: "Any day",
    timeOfDay: "Any time",
  });

  const handleSearch = (query: string) => {
    // This will be handled by the Map component
    const mapElement = document.querySelector("[data-map-component]");
    if (mapElement) {
      const event = new CustomEvent("search", { detail: query });
      mapElement.dispatchEvent(event);
    }
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  return (
    <>
      <Header
        showMap={showMap}
        onSearch={handleSearch}
        userLocation={userLocation}
        onFilterChange={handleFilterChange}
      />

      <main
        className={`min-h-screen bg-gray-50 ${showMap ? "pt-24" : "pt-32"}`}
      >
        <Map
          showMap={showMap}
          setShowMap={setShowMap}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          setUserLocation={setUserLocation}
          filters={filters}
        />
      </main>
    </>
  );
}
