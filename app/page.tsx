import Header from "./components/header";
import Map from "./components/map";
export default function Home() {
  return (
    <>
      <Header />

      <main className="pt-20 md:pt-24 min-h-screen bg-gray-50">
        <div className="max-w-[2520px] mx-auto px-4 sm:px-6 lg:px-8">
          <Map />
        </div>
      </main>
    </>
  );
}
