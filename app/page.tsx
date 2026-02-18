"use client";

import CampusMap from "@/components/campus-map";
import Navigation from "@/components/navigation";
import SelectYourUniversity from "@/components/select-your-university";
import { useSubmissions, useUniversities } from "@/hooks";

export default function Home() {
  const { submissions, isLoading: submissionsLoading } = useSubmissions();
  const {
    universities,
    isLoading: universitiesLoading,
    page,
    setPage,
    totalPages,
    totalCount,
  } = useUniversities();
  return (
    <main className="flex flex-col space-y-5 w-full py-5">
      <Navigation />

      <section className="w-full bg-white dark:bg-gray-900 flex flex-col gap-2 items-start justify-center px-4 py-6 rounded-lg border border-[#E5E7EB] dark:border-gray-800">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          Our Mission
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          We connect high school students with real insights from university
          students. Ask questions, share resources, and learn how to join clubs,
          programs, and communities across top universities.
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        {/* CAMPUS MAP */}
        <div>
          <CampusMap />
        </div>

        {/* Select Your University */}
        <div>
          <SelectYourUniversity
            universities={universities}
            submissions={submissions}
            isLoading={universitiesLoading}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
            totalCount={totalCount}
          />
        </div>
      </section>
    </main>
  );
}
