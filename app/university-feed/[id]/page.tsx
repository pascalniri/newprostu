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
            {/* Responsive Container: Mobile (Stack) / Desktop (Sidebar Right) */}
            <div className="flex flex-col lg:flex-row gap-6 lg:items-start max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Main Feed Column */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                    Community Feed
                  </h2>
                </div>

                <FeedList universityName={university.name} />
              </div>

              {/* Sidebar Column */}
              <div className="w-full lg:w-80 xl:w-96 shrink-0 lg:sticky lg:top-24 space-y-6 order-first lg:order-last">
                {/* University Card / Header */}
                <div className="overflow-hidden">
                  <UniversityHeader university={university} />
                </div>

                {/* Guidelines or other widgets can go here */}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
