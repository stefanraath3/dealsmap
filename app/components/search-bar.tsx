"use client";
import { useEffect, useRef, useState } from "react";

interface Suggestion {
  place_name: string;
  center: [number, number];
}

interface SearchBarProps {
  onSearch?: (query: string) => void;
  userLocation?: { lng: number; lat: number } | null;
  compact?: boolean;
}

const SearchBar = ({ onSearch, userLocation, compact }: SearchBarProps) => {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch?.(value);
  };

  return (
    <div
      ref={searchContainerRef}
      className={`relative ${compact ? "w-full" : "w-full max-w-3xl mx-auto"}`}
    >
      <div className="bg-gray-50 rounded-full hover:shadow-md transition-all duration-300">
        <div className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search deals..."
            className={`w-full pl-12 pr-4 ${
              compact ? "py-2.5" : "py-3"
            } bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none transition-shadow duration-200`}
          />
          <div className="absolute left-5 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`${compact ? "h-4 w-4" : "h-5 w-5"}`}
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
    </div>
  );
};

export default SearchBar;
