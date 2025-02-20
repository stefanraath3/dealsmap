import Link from "next/link";
import { useEffect, useState } from "react";
import SearchBar from "./search-bar";

interface HeaderProps {
  showMap?: boolean;
  onSearch?: (query: string) => void;
  userLocation?: { lng: number; lat: number } | null;
}

const Header = ({ showMap, onSearch, userLocation }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white">
      {/* Top header */}
      <div
        className={`border-b border-gray-200 transition-all duration-300 ${
          isScrolled ? "py-3" : "py-5"
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
      <div className="border-b border-gray-200 overflow-x-auto">
        <div className="max-w-[2520px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 py-3">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200 font-medium transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm">Filters</span>
            </button>
            <div className="flex items-center gap-4 text-sm">
              <button className="px-4 py-2.5 rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200 font-medium transition-colors whitespace-nowrap">
                Price
              </button>
              <button className="px-4 py-2.5 rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200 font-medium transition-colors whitespace-nowrap">
                Type of Deal
              </button>
              <button className="px-4 py-2.5 rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200 font-medium transition-colors whitespace-nowrap">
                Day of Week
              </button>
              <button className="px-4 py-2.5 rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200 font-medium transition-colors whitespace-nowrap">
                Time of Day
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
