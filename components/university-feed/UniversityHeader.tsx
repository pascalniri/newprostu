"use client";

import { MapPin, ChevronLeft, ChevronRight, X } from "lucide-react";
import { University } from "@/types/database";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface UniversityHeaderProps {
  university: University;
}

export default function UniversityHeader({
  university,
}: UniversityHeaderProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );

  const handlePrevious = () => {
    if (selectedImageIndex !== null && university.gallery_urls) {
      setSelectedImageIndex((prev) =>
        prev === 0 ? university.gallery_urls!.length - 1 : prev! - 1,
      );
    }
  };

  const handleNext = () => {
    if (selectedImageIndex !== null && university.gallery_urls) {
      setSelectedImageIndex((prev) =>
        prev === university.gallery_urls!.length - 1 ? 0 : prev! + 1,
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") handlePrevious();
    if (e.key === "ArrowRight") handleNext();
  };

  return (
    <div className="w-full space-y-6">
      {/* Main Info Card */}
      <div className="w-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Banner / Cover */}
        <div
          className="h-32 w-full relative"
          style={{ backgroundColor: university.color_primary || "#00274C" }}
        >
          <div className="absolute -bottom-10 left-8">
            <div
              className="w-24 h-24 rounded-xl border-4 border-white dark:border-gray-800 flex items-center justify-center text-3xl font-bold shadow-sm overflow-hidden bg-white dark:bg-gray-800"
              style={{
                backgroundColor: !university.logo_url
                  ? university.color_primary || "#ffffff"
                  : undefined,
                color: !university.logo_url
                  ? university.color_secondary || "#000000"
                  : undefined,
              }}
            >
              {university.logo_url ? (
                <img
                  src={university.logo_url}
                  alt={university.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                university.abbreviation?.substring(0, 2) ||
                university.name.substring(0, 2)
              )}
            </div>
          </div>
        </div>

        <div className="pt-12 pb-6 px-8">
          <div className="flex flex-col items-start md:flex-row lg:flex-col md:items-center lg:items-start justify-between gap-4">
            <div className="flex flex-col items-start">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {university.name}
              </h1>
              <div className="flex items-center gap-2 text-blue-500 dark:text-gray-400 mt-1 bg-[#f6f3ed] p-3 rounded">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Google_Maps_icon_%282015-2020%29.svg/960px-Google_Maps_icon_%282015-2020%29.svg.png"
                  alt={university.name}
                  width={20}
                  height={20}
                />
                {university.latitude && university.longitude ? (
                  <Link
                    href={`https://www.google.com/maps/search/?api=1&query=${university.latitude},${university.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline hover:text-blue-600 transition-colors font-semibold"
                  >
                    View Campus Location
                  </Link>
                ) : (
                  <span className="text-sm">Location not set</span>
                )}
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 text-xs">
              Welcome to the {university.name} community feed. Connect with
              fellow students, share resources, and ask questions specific to
              your campus.
            </p>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      {university.gallery_urls && university.gallery_urls.length > 0 && (
        <div className="w-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Campus Gallery
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {university.gallery_urls.slice(0, 4).map((url, index) => (
              <div
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className="relative aspect-video rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
              >
                <Image
                  src={url}
                  width={400}
                  height={400}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {index === 3 && university.gallery_urls.length > 4 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      +{university.gallery_urls.length - 4}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox / Carousel Dialog */}
      <Dialog
        open={selectedImageIndex !== null}
        onOpenChange={(open) => !open && setSelectedImageIndex(null)}
      >
        <DialogContent
          className="max-w-screen-lg w-full p-0 overflow-hidden bg-black/90 border-none h-[90vh] flex flex-col justify-center items-center focus:outline-none"
          onKeyDown={handleKeyDown}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <DialogClose className="absolute cursor-pointer top-4 right-4 z-50 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors">
              <X size={14} />
            </DialogClose>

            {/* Previous Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 z-50 text-white hover:bg-white/20 hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
            >
              <ChevronLeft size={14} />
            </Button>

            {/* Image */}
            {selectedImageIndex !== null && university.gallery_urls && (
              <div className="relative w-full h-full flex items-center justify-center p-4">
                <img
                  src={university.gallery_urls[selectedImageIndex]}
                  alt={`Gallery ${selectedImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}

            {/* Next Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 z-50 text-white hover:bg-white/20 hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
            >
              <ChevronRight size={14} />
            </Button>
          </div>

          {/* Image Counter */}
          {selectedImageIndex !== null && university.gallery_urls && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm">
              {selectedImageIndex + 1} / {university.gallery_urls.length}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
