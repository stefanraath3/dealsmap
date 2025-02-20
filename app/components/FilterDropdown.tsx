import { useEffect, useRef } from "react";

interface FilterDropdownProps {
  title: string;
  options: string[];
  selectedOption: string | null;
  onSelect: (option: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterDropdown({
  title,
  options,
  selectedOption,
  onSelect,
  isOpen,
  onClose,
}: FilterDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div ref={dropdownRef} className="relative">
      <div
        className={`absolute top-full left-0 mt-2 w-56 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-200 z-50 ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="p-2">
          <div className="px-3 py-2 text-sm font-semibold text-gray-900">
            {title}
          </div>
          <div className="mt-2 space-y-1">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onSelect(option);
                  onClose();
                }}
                className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                  selectedOption === option
                    ? "bg-rose-50 text-rose-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {selectedOption === option && (
                  <svg
                    className="mr-2 h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
