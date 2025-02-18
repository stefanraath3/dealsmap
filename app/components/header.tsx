import Link from "next/link";
import { testDbConnection } from "../actions/test-db";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-[2520px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img src="/logo.svg" alt="DealsMap" className="w-8 h-8" />
            <span className="ml-2 text-rose-500 text-xl font-bold">
              DealsMap
            </span>
          </Link>
          <button onClick={testDbConnection}>Test DB Connection</button>
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
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
          <button className="md:hidden p-2 rounded-full hover:bg-gray-100">
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
      </div>
    </header>
  );
};

export default Header;
