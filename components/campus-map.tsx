"use client";

import { useUniversities } from "@/hooks";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

const MapInner = dynamic(() => import("@/components/map/MapInner"), {
  ssr: false,
  loading: () => <p>Loading Map...</p>,
});

export default function CampusMap() {
  const { universities } = useUniversities();

  const activeUniversities = universities.filter(
    (uni) => uni.latitude !== null && uni.longitude !== null && uni.is_active,
  );

  return (
    <div className="min-h-[60vh] w-full bg-white flex flex-col gap-2 items-start justify-start p-4 rounded-lg border border-[#E5E7EB]">
      <h1 className="text-lg font-semibold">Campus Map</h1>
      <div className="bg-white w-full h-[500px] rounded-lg overflow-hidden relative z-0">
        <MapInner universities={activeUniversities} />
      </div>
      <p className="text-gray-500 text-xs">
        Tip: Select a university below to enter its community.
      </p>
    </div>
  );
}
