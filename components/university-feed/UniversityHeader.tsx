"use client";

import { MapPin } from "lucide-react";
import { University } from "@/types/database";

interface UniversityHeaderProps {
  university: University;
}

export default function UniversityHeader({
  university,
}: UniversityHeaderProps) {
  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
      <div
        className="h-32 w-full relative"
        style={{ backgroundColor: university.color_primary || "#00274C" }}
      >
        <div className="absolute -bottom-10 left-8">
          <div
            className="w-24 h-24 rounded-xl border-4 border-white dark:border-gray-800 shadow-md flex items-center justify-center text-3xl font-bold bg-white text-gray-900"
            style={{ color: university.color_primary }}
          >
            {university.abbreviation?.substring(0, 2) ||
              university.name.substring(0, 2)}
          </div>
        </div>
      </div>

      <div className="pt-12 pb-6 px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {university.name}
            </h1>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mt-1">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">
                {university.latitude && university.longitude
                  ? "Campus Location Available"
                  : "Location not set"}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="text-center px-4 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="block text-lg font-bold text-gray-900 dark:text-white">
                --
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Posts
              </span>
            </div>
            <div className="text-center px-4 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="block text-lg font-bold text-gray-900 dark:text-white">
                --
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Members
              </span>
            </div>
          </div>
        </div>

        <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-3xl">
          Welcome to the {university.name} community feed. Connect with fellow
          students, share resources, and ask questions specific to your campus.
        </p>
      </div>
    </div>
  );
}
