import Link from "next/link";
import { useState } from "react";
import { Deal } from "../data/deals";

interface DealCardProps {
  deal: Deal;
}

const DealCard = ({ deal }: DealCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <Link href={`/deals/${deal.id}`} className="block group">
      <div className="space-y-4">
        {/* Image carousel */}
        <div className="aspect-square w-full relative overflow-hidden rounded-xl">
          {deal.images && deal.images.length > 0 ? (
            <>
              <img
                src={deal.images[currentImageIndex]}
                alt={deal.title}
                className="h-full w-full object-cover transition group-hover:scale-105"
              />

              {/* Image navigation buttons */}
              {deal.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                  {deal.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentImageIndex(index);
                      }}
                      className={`w-1.5 h-1.5 rounded-full transition ${
                        currentImageIndex === index ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Previous/Next buttons */}
              {deal.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentImageIndex((prev) =>
                        prev === 0 ? deal.images!.length - 1 : prev - 1
                      );
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white/80 opacity-0 group-hover:opacity-100 transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentImageIndex((prev) =>
                        prev === deal.images!.length - 1 ? 0 : prev + 1
                      );
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white/80 opacity-0 group-hover:opacity-100 transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="h-full w-full bg-gray-200 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Deal info */}
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-gray-900">{deal.title}</h3>
            {deal.price && (
              <span className="font-medium text-gray-900">R{deal.price}</span>
            )}
          </div>
          <div className="text-sm text-gray-500 space-y-1">
            <p>{deal.location}</p>
            {deal.timeWindow && <p>{deal.timeWindow}</p>}
            {deal.day && <p>{deal.day}</p>}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DealCard;
