"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUniversities } from "@/hooks/useUniversities";
import Navigation from "@/components/navigation";
import UniversityHeader from "@/components/university-feed/UniversityHeader";
import FeedList from "@/components/university-feed/FeedList";
import { University } from "@/types/database";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UniversityFeedPage() {
  const params = useParams();
  const router = useRouter();
  const { universities, isLoading: universitiesLoading } = useUniversities();
  const [university, setUniversity] = useState<University | null>(null);

  useEffect(() => {
    if (universities.length > 0 && params.id) {
      const found = universities.find((u) => u.id === params.id);
      if (found) {
        setUniversity(found);
      }
    }
  }, [universities, params.id]);

  if (universitiesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F3ED]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!university && !universitiesLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F6F3ED] p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          University Not Found
        </h1>
        <Button onClick={() => router.push("/")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F3ED] pb-12">
      <div className="py-6">
        <Navigation />
      </div>

      <main className="space-y-6">
        {university && (
          <>
            <UniversityHeader university={university} />

            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Community Feed
                  </h2>
                  {/* Potential "Create Post" button could go here */}
                </div>

                <FeedList universityName={university.name} />
              </div>

              {/* Sidebar / Right Column (Optional - e.g. Trending topics, Rules) */}
              <div className="w-full lg:w-80 space-y-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Community Guidelines
                  </h3>
                  <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300 list-disc list-inside">
                    <li>Be respectful and constructive.</li>
                    <li>Verify information before sharing.</li>
                    <li>Stay on topic for each channel.</li>
                    <li>Report inappropriate content.</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
