"use client";

import { Deal } from "@/app/data/deals";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Link from "next/link";
import { useEffect, useState } from "react";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

export default function DealPageClient({ id }: { id: string }) {
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchDeal = async () => {
      try {
        const response = await fetch(`/api/deals/${id}`);
        if (!response.ok) throw new Error("Failed to fetch deal");
        const data = await response.json();
        setDeal(data);
      } catch (error) {
        console.error("Error fetching deal:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeal();
  }, [id]);

  useEffect(() => {
    if (!deal || !mapboxgl.accessToken) return;

    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [parseFloat(deal.longitude), parseFloat(deal.latitude)],
      zoom: 15,
    });

    new mapboxgl.Marker()
      .setLngLat([parseFloat(deal.longitude), parseFloat(deal.latitude)])
      .addTo(map);

    return () => map.remove();
  }, [deal]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading deal...</div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Deal not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="flex items-center text-gray-800 hover:text-gray-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="ml-2">Back to deals</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-16">
        {/* Image gallery */}
        <div className="relative h-96">
          {deal.images && deal.images.length > 0 ? (
            <>
              <img
                src={deal.images[currentImageIndex]}
                alt={deal.title}
                className="w-full h-full object-cover"
              />
              {deal.images.length > 1 && (
                <>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                    {deal.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition ${
                          currentImageIndex === index
                            ? "bg-white"
                            : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() =>
                      setCurrentImageIndex((prev) =>
                        prev === 0 ? deal.images!.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
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
                    onClick={() =>
                      setCurrentImageIndex((prev) =>
                        prev === deal.images!.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
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
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-gray-400"
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {deal.title}
                </h1>
                <p className="mt-2 text-lg text-gray-600">{deal.description}</p>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-semibold text-gray-900">Details</h2>
                <dl className="mt-4 space-y-4">
                  {deal.price && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Price
                      </dt>
                      <dd className="mt-1 text-lg text-gray-900">
                        R{deal.price}
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Location
                    </dt>
                    <dd className="mt-1 text-lg text-gray-900">
                      {deal.location}
                    </dd>
                  </div>
                  {deal.day && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Available
                      </dt>
                      <dd className="mt-1 text-lg text-gray-900">{deal.day}</dd>
                    </div>
                  )}
                  {deal.timeWindow && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Time
                      </dt>
                      <dd className="mt-1 text-lg text-gray-900">
                        {deal.timeWindow}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>

            {/* Map */}
            <div className="bg-gray-100 rounded-lg overflow-hidden h-96">
              <div id="map" className="w-full h-full" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
