"use client";

import Navigation from "@/components/navigation";
import HomeFeed from "@/components/home-feed";
import HomeSidebar from "@/components/home-sidebar";
import { useContent, useUniversities } from "@/hooks";

export default function Home() {
  const { content, isLoading: contentLoading } = useContent();
  const { universities, isLoading: universitiesLoading } = useUniversities();

  return (
    <main className="flex flex-col w-full min-h-screen bg-[#F6F3ED] dark:bg-black font-sans">
      {/* 
        Container adjusted to be wider on large monitors. 
        Using max-w-[1600px] instead of max-w-7xl to provide ample width.
      */}
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col space-y-5">
        <Navigation />

        <div className="flex flex-col lg:flex-row gap-8 items-start mt-2">
          {/* Main Feed Column (Approx 75% width on very large screens) */}
          <section className="flex-1 lg:flex-[3] xl:flex-[4] w-full min-w-0">
            <HomeFeed
              posts={content}
              isLoading={contentLoading}
              universities={universities}
            />
          </section>

          {/* Right Sidebar Column (Fixed max width, flex shrink logic) */}
          <section className="flex-1 w-full lg:w-[320px] xl:w-[350px] shrink-0 space-y-6">
            <HomeSidebar
              universities={universities}
              isLoading={universitiesLoading}
            />

            {/* Mission Statement (moved to sidebar) */}
            <div className="bg-white dark:bg-gray-900 border border-[#E5E7EB] dark:border-gray-800 shadow-sm rounded-sm p-5 flex flex-col gap-2">
              <h3 className="text-[15px] font-bold text-gray-800 dark:text-gray-200">
                Our Mission
              </h3>
              <p className="text-[13px] text-gray-600 dark:text-gray-400 leading-relaxed">
                We connect high school students with real insights from
                university students. Ask questions, share resources, and learn
                how to join clubs, programs, and communities across top
                universities.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
