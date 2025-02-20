import { Suspense } from "react";
import DealPageClient from "./DealPageClient";

// This is the server component that wraps the client component
export default function DealPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<DealPageLoading />}>
      <DealPageClient id={params.id} />
    </Suspense>
  );
}

// Loading component
function DealPageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-600">Loading deal...</div>
    </div>
  );
}
