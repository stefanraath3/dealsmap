import { cn } from "../../lib/utils";

const shimmer =
  "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

export default function DealPageSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center text-gray-800">
              <div className={cn("h-5 w-24 rounded-lg bg-gray-200", shimmer)} />
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-16">
        {/* Image gallery skeleton */}
        <div className="relative h-96">
          <div className={cn("w-full h-full bg-gray-200", shimmer)} />
        </div>

        {/* Deal info */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                {/* Title skeleton */}
                <div
                  className={cn(
                    "h-8 w-3/4 rounded-lg bg-gray-200 mb-4",
                    shimmer
                  )}
                />
                {/* Description skeleton */}
                <div
                  className={cn("h-6 w-full rounded-lg bg-gray-200", shimmer)}
                />
              </div>

              <div className="border-t border-gray-200 pt-6">
                {/* Details section */}
                <div
                  className={cn(
                    "h-6 w-32 rounded-lg bg-gray-200 mb-4",
                    shimmer
                  )}
                />
                <dl className="mt-4 space-y-4">
                  {/* Price skeleton */}
                  <div>
                    <div
                      className={cn(
                        "h-4 w-16 rounded-lg bg-gray-200 mb-1",
                        shimmer
                      )}
                    />
                    <div
                      className={cn("h-6 w-24 rounded-lg bg-gray-200", shimmer)}
                    />
                  </div>
                  {/* Location skeleton */}
                  <div>
                    <div
                      className={cn(
                        "h-4 w-20 rounded-lg bg-gray-200 mb-1",
                        shimmer
                      )}
                    />
                    <div
                      className={cn("h-6 w-48 rounded-lg bg-gray-200", shimmer)}
                    />
                  </div>
                  {/* Available skeleton */}
                  <div>
                    <div
                      className={cn(
                        "h-4 w-24 rounded-lg bg-gray-200 mb-1",
                        shimmer
                      )}
                    />
                    <div
                      className={cn("h-6 w-32 rounded-lg bg-gray-200", shimmer)}
                    />
                  </div>
                  {/* Time skeleton */}
                  <div>
                    <div
                      className={cn(
                        "h-4 w-16 rounded-lg bg-gray-200 mb-1",
                        shimmer
                      )}
                    />
                    <div
                      className={cn("h-6 w-40 rounded-lg bg-gray-200", shimmer)}
                    />
                  </div>
                </dl>
              </div>
            </div>

            {/* Map skeleton */}
            <div className={cn("bg-gray-200 rounded-lg h-96", shimmer)} />
          </div>
        </div>
      </main>
    </div>
  );
}
