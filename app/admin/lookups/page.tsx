"use client";

import { AdminNav } from "@/components/admin-nav";
import Campuses from "@/components/campuses";
import GradeLevels from "@/components/grade-levels";
import Schools from "@/components/schools";
import Topics from "@/components/topics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Universities from "@/components/universities";
import useMe from "@/hooks/useMe";

export default function LookupsPage() {
  const { user, loadingMe, getUser } = useMe();

  return (
    <main className="flex flex-col space-y-5 w-full py-5 px-4 max-w-7xl mx-auto">
      <AdminNav user={user} loadingMe={loadingMe} getUser={getUser} />

      <section className="w-full bg-white flex flex-col gap-1 items-start justify-center px-6 py-8 rounded-lg border border-[#E5E7EB]">
        <h2 className="text-lg font-semibold">Manage Lookups</h2>
        <p className="text-gray-600">
          Manage universities, topics, schools, campuses, and grade levels.
        </p>

        <section className="mt-5 w-full">
          <Tabs defaultValue="universities">
            <TabsList variant="line">
              <TabsTrigger value="universities">Universities</TabsTrigger>
              <TabsTrigger value="topics">Topics</TabsTrigger>
              <TabsTrigger value="schools">Schools</TabsTrigger>
              <TabsTrigger value="campuses">Campuses</TabsTrigger>
              <TabsTrigger value="grade-levels">Grade Levels</TabsTrigger>
            </TabsList>
            <TabsContent value="universities" className="mt-4">
              <Universities />
            </TabsContent>
            <TabsContent value="topics" className="mt-4">
              <Topics />
            </TabsContent>
            <TabsContent value="schools" className="mt-4">
              <Schools />
            </TabsContent>
            <TabsContent value="campuses" className="mt-4">
              <Campuses />
            </TabsContent>
            <TabsContent value="grade-levels" className="mt-4">
              <GradeLevels />
            </TabsContent>
          </Tabs>
        </section>
      </section>
    </main>
  );
}
