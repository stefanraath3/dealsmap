"use client";

import { useState } from "react";
import Header from "./components/header";
import Map from "./components/map";

export default function Home() {
  const [showMap, setShowMap] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [userLocation, setUserLocation] = useState<{
    lng: number;
    lat: number;
  } | null>(null);

  const handleSearch = (query: string) => {
    // This will be handled by the Map component
    const mapElement = document.querySelector("[data-map-component]");
    if (mapElement) {
      const event = new CustomEvent("search", { detail: query });
      mapElement.dispatchEvent(event);
    }
  };

  return (
    <>
      <Header
        showMap={showMap}
        onSearch={handleSearch}
        userLocation={userLocation}
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
        />
      </main>
    </>
  );
}
