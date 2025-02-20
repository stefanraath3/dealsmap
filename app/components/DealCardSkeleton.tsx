import { cn } from "@/lib/utils";

const shimmer =
  "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

export default function DealCardSkeleton() {
  return (
    <div className="space-y-4">
      {/* Image skeleton */}
      <div
        className={cn(
          "relative aspect-square w-full overflow-hidden rounded-xl bg-gray-200",
          shimmer
        )}
      />

      {/* Content skeleton */}
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          {/* Title skeleton */}
          <div
            className={cn("relative h-6 w-3/4 rounded-lg bg-gray-200", shimmer)}
          />
          {/* Price skeleton */}
          <div
            className={cn("relative h-6 w-16 rounded-lg bg-gray-200", shimmer)}
          />
        </div>
        <div className="space-y-1">
          {/* Location skeleton */}
          <div
            className={cn("relative h-4 w-1/2 rounded-lg bg-gray-200", shimmer)}
          />
          {/* Time window skeleton */}
          <div
            className={cn("relative h-4 w-1/3 rounded-lg bg-gray-200", shimmer)}
          />
          {/* Day skeleton */}
          <div
            className={cn("relative h-4 w-1/4 rounded-lg bg-gray-200", shimmer)}
          />
        </div>
      </div>
    </div>
  );
}
