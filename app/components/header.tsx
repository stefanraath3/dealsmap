import Link from "next/link";
import { useEffect, useState } from "react";
import FilterDropdown from "./FilterDropdown";
import SearchBar from "./search-bar";

interface HeaderProps {
  showMap?: boolean;
  onSearch?: (query: string) => void;
  userLocation?: { lng: number; lat: number } | null;
  onFilterChange?: (filterType: string, value: string) => void;
}

const priceRanges = [
  "Any price",
  "Under R50",
  "R50 - R100",
  "R100 - R200",
  "R200+",
];

const dealTypes = [
  "All deals",
  "Food & Drink",
  "Entertainment",
  "Shopping",
  "Fitness",
  "Beauty & Spa",
];

const daysOfWeek = [
  "Any day",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const timeOfDay = [
  "Any time",
  "Morning (6AM-12PM)",
  "Afternoon (12PM-5PM)",
  "Evening (5PM-10PM)",
  "Late Night (10PM-6AM)",
];

const Header = ({
  showMap,
  onSearch,
  userLocation,
  onFilterChange,
}: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState({
    price: "Any price",
    dealType: "All deals",
    dayOfWeek: "Any day",
    timeOfDay: "Any time",
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleFilterSelect = (filterType: string, value: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
    onFilterChange?.(filterType, value);
  };

  return (
    <>
      {/* Fixed header container */}
      <div className="fixed top-0 left-0 right-0 z-50">
        {/* Header content wrapper */}
        <div className="bg-white shadow-sm">
          {/* Top header */}
          <div
            className={`relative z-20 border-b border-gray-200 transition-all duration-300 ${
              isScrolled ? "py-2" : "py-3"
            }`}
          >
            <div className="max-w-[2520px] mx-auto">
              <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link href="/" className="flex items-center shrink-0">
                  <img src="/logo.svg" alt="DealsMap" className="w-8 h-8" />
                  <span className="ml-2 text-rose-500 text-xl font-bold">
                    DealsMap
                  </span>
                </Link>

                {/* Search bar */}
                <div className="flex-1 max-w-2xl mx-8">
                  <div
                    className={`transition-all duration-300 transform ${
                      isScrolled ? "scale-95 -translate-y-1" : "scale-100"
                    }`}
                  >
                    <SearchBar
                      onSearch={onSearch}
                      userLocation={userLocation}
                      compact={isScrolled}
                    />
                  </div>
                </div>

                {/* Right navigation */}
                <div className="flex items-center gap-6">
                  <Link
                    href="/add-deal"
                    className="hidden md:block font-medium text-gray-500 hover:text-gray-800 transition-colors"
                  >
                    Add your deal
                  </Link>
                  <button className="hidden md:block p-3 rounded-full hover:bg-gray-100 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <button className="flex items-center gap-3 p-1 pl-3 rounded-full border border-gray-200 hover:shadow-md transition-all">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom header - Filters */}
          <div className="relative z-20 border-b border-gray-200 bg-white">
            <div className="max-w-[2520px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-6 py-2">
                <div className="flex items-center gap-4 text-sm">
                  <div className="relative">
                    <button
                      onClick={() =>
                        setActiveFilter(
                          activeFilter === "price" ? null : "price"
                        )
                      }
                      className={`px-4 py-2 rounded-full font-medium transition-colors whitespace-nowrap ${
                        selectedFilters.price !== "Any price"
                          ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      {selectedFilters.price}
                    </button>
                    <FilterDropdown
                      title="Price Range"
                      options={priceRanges}
                      selectedOption={selectedFilters.price}
                      onSelect={(value) => handleFilterSelect("price", value)}
                      isOpen={activeFilter === "price"}
                      onClose={() => setActiveFilter(null)}
                    />
                  </div>

                  <div className="relative">
                    <button
                      onClick={() =>
                        setActiveFilter(
                          activeFilter === "dealType" ? null : "dealType"
                        )
                      }
                      className={`px-4 py-2 rounded-full font-medium transition-colors whitespace-nowrap ${
                        selectedFilters.dealType !== "All deals"
                          ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      {selectedFilters.dealType}
                    </button>
                    <FilterDropdown
                      title="Type of Deal"
                      options={dealTypes}
                      selectedOption={selectedFilters.dealType}
                      onSelect={(value) =>
                        handleFilterSelect("dealType", value)
                      }
                      isOpen={activeFilter === "dealType"}
                      onClose={() => setActiveFilter(null)}
                    />
                  </div>

                  <div className="relative">
                    <button
                      onClick={() =>
                        setActiveFilter(
                          activeFilter === "dayOfWeek" ? null : "dayOfWeek"
                        )
                      }
                      className={`px-4 py-2 rounded-full font-medium transition-colors whitespace-nowrap ${
                        selectedFilters.dayOfWeek !== "Any day"
                          ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      {selectedFilters.dayOfWeek}
                    </button>
                    <FilterDropdown
                      title="Day of Week"
                      options={daysOfWeek}
                      selectedOption={selectedFilters.dayOfWeek}
                      onSelect={(value) =>
                        handleFilterSelect("dayOfWeek", value)
                      }
                      isOpen={activeFilter === "dayOfWeek"}
                      onClose={() => setActiveFilter(null)}
                    />
                  </div>

                  <div className="relative">
                    <button
                      onClick={() =>
                        setActiveFilter(
                          activeFilter === "timeOfDay" ? null : "timeOfDay"
                        )
                      }
                      className={`px-4 py-2 rounded-full font-medium transition-colors whitespace-nowrap ${
                        selectedFilters.timeOfDay !== "Any time"
                          ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      {selectedFilters.timeOfDay}
                    </button>
                    <FilterDropdown
                      title="Time of Day"
                      options={timeOfDay}
                      selectedOption={selectedFilters.timeOfDay}
                      onSelect={(value) =>
                        handleFilterSelect("timeOfDay", value)
                      }
                      isOpen={activeFilter === "timeOfDay"}
                      onClose={() => setActiveFilter(null)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer to prevent content from going under the fixed header */}
      <div className={`${isScrolled ? "h-[84px]" : "h-[96px]"}`} />
    </>
  );
};

export default Header;
