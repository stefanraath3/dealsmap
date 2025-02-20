import Link from "next/link";
import SearchBar from "./search-bar";

interface HeaderProps {
  showMap?: boolean;
  onSearch?: (query: string) => void;
  userLocation?: { lng: number; lat: number } | null;
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
}

const categories = ["All", "Food", "Shopping", "Fitness"];

const Header = ({
  showMap,
  onSearch,
  userLocation,
  selectedCategory = "All",
  onCategoryChange,
}: HeaderProps) => {
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 transition-all duration-300 ${
        showMap ? "h-16" : "h-auto"
      }`}
    >
      <div className="max-w-[2520px] mx-auto">
        <div
          className={`flex items-center h-16 px-4 sm:px-6 lg:px-8 ${
            showMap ? "pb-0" : "pb-2"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <img src="/logo.svg" alt="DealsMap" className="w-8 h-8" />
            <span className="ml-2 text-rose-500 text-xl font-bold">
              DealsMap
            </span>
          </Link>

          {/* Search bar - shown in header when map is visible */}
          {showMap && onSearch && (
            <div className="flex-1 mx-4">
              <SearchBar
                onSearch={onSearch}
                userLocation={userLocation}
                compact
              />
            </div>
          )}

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8 shrink-0">
            <Link
              href="/"
              className="text-gray-500 hover:text-gray-800 transition-colors"
            >
              Explore
            </Link>
            <Link
              href="/about"
              className="text-gray-500 hover:text-gray-800 transition-colors"
            >
              About
            </Link>
            <button className="px-4 py-2 rounded-full bg-rose-500 text-white hover:bg-rose-600 transition-colors">
              Add Deal
            </button>
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-full hover:bg-gray-100 ml-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Search bar and categories - shown below header when map is not visible */}
        {!showMap && (
          <div className="px-4 sm:px-6 lg:px-8 pb-4">
            {onSearch && (
              <div className="mb-4">
                <SearchBar onSearch={onSearch} userLocation={userLocation} />
              </div>
            )}

            {onCategoryChange && (
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => onCategoryChange(category)}
                    className={`px-4 py-1.5 rounded-full font-medium transition-all duration-200 text-sm ${
                      selectedCategory === category
                        ? "bg-rose-500 text-white hover:bg-rose-600"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
