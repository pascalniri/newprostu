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
  const { getUniversity } = useUniversities();
  const [university, setUniversity] = useState<University | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUniversity = async () => {
      if (params.id) {
        setIsLoading(true);
        const result = await getUniversity(params.id as string);
        if (result.success) {
          setUniversity(result.data);
        }
        setIsLoading(false);
      }
    };

    loadUniversity();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F3ED]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!university && !isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9F9] dark:bg-black p-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
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
    <div className="min-h-screen bg-[#F6F3ED] dark:bg-black pb-12 font-sans">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col space-y-5">
        <Navigation />

        <main className="space-y-6 mt-2">
          {university && (
            <>
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Main Feed Column */}
                <div className="flex-1 lg:flex-[3] xl:flex-[4] w-full min-w-0">
                  {/* <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                    Community Feed
                  </h2>
                </div> */}

                  <FeedList universityName={university.name} />
                </div>

                {/* Sidebar Column */}
                <div className="w-full lg:w-[320px] xl:w-[350px] shrink-0 space-y-6 order-first lg:order-last">
                  {/* University Card / Header */}
                  <div className="overflow-hidden bg-white dark:bg-gray-900 border border-[#E5E7EB] dark:border-gray-800 rounded-sm">
                    <UniversityHeader university={university} />
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
