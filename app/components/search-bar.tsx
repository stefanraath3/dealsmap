"use client";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";

interface Suggestion {
  place_name: string;
  center: [number, number];
}

interface SearchBarProps {
  onSearch: (query: string) => void;
  userLocation?: { lng: number; lat: number } | null;
}

const SearchBar = ({ onSearch, userLocation }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = async (input: string) => {
    if (!input.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        input
      )}.json?access_token=${mapboxgl.accessToken}`;

      if (userLocation) {
        url += `&proximity=${userLocation.lng},${userLocation.lat}`;
      }

      url +=
        "&country=ZA&types=place,poi,address,locality,neighborhood&fuzzyMatch=true&language=en&limit=5";

      const response = await fetch(url);
      const data = await response.json();
      setSuggestions(data.features || []);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(true);
    fetchSuggestions(value);
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setQuery(suggestion.place_name);
    setSuggestions([]);
    setShowSuggestions(false);
    onSearch(suggestion.place_name);
  };

  return (
    <div ref={searchContainerRef} className="relative w-full max-w-3xl mx-auto">
      <div className="relative">
        <div className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search location..."
            className="w-full pl-14 pr-6 py-4 bg-white rounded-full shadow-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-shadow duration-200"
          />
          <div className="absolute left-5 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute w-full mt-2 bg-white rounded-3xl shadow-lg z-50 max-h-96 overflow-auto border border-gray-100">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-6 py-4 hover:bg-gray-50 cursor-pointer flex items-center gap-3 border-b last:border-b-0 border-gray-100"
            >
              <div className="text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-gray-700 font-medium">
                {suggestion.place_name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
