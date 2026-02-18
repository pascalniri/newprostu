"use client";

import { useUniversities } from "@/hooks";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { Maximize2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";

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
      <div className="flex items-center justify-between w-full">
        <h1 className="text-lg font-semibold">Campus Map</h1>
        <Dialog>
          <DialogTrigger asChild>
            <button
              className="text-gray-500 hover:text-gray-900 transition-colors p-1"
              aria-label="View Fullscreen"
            >
              <Maximize2 size={20} />
            </button>
          </DialogTrigger>
          <DialogContent className="min-w-[90vw] w-full h-[90vh] p-0 overflow-hidden bg-white">
            <div className="relative w-full h-full">
              <DialogTitle className="sr-only">
                Full Screen Campus Map
              </DialogTitle>
              <DialogClose className="absolute top-4 right-4 z-[9999] bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors cursor-pointer">
                <X size={24} />
              </DialogClose>
              <MapInner universities={activeUniversities} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="bg-white w-full h-[500px] rounded-lg overflow-hidden relative z-0">
        <MapInner universities={activeUniversities} />
      </div>
      <p className="text-gray-500 text-xs">
        Tip: Select a university below to enter its community.
      </p>
    </div>
  );
}
