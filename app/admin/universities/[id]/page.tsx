"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUniversities } from "@/hooks/useUniversities";
import { useContent } from "@/hooks/useContent";
import UniversityHeader from "@/components/university-feed/UniversityHeader";
import { University, ApprovedContent } from "@/types/database";
import { Loader2, ArrowLeft, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostItem from "@/components/university-feed/PostItem";
import CreateUniversityDialog from "@/dialogs/create-university";

export default function UniversityDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { getUniversity } = useUniversities();
  const [university, setUniversity] = useState<University | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Content fetching
  // We need university name to fetch content, so we wait for university to be loaded
  const {
    content,
    isLoading: isContentLoading,
    refetch: refetchContent,
  } = useContent(university ? { university: university.name } : undefined);

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
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!university && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <h1 className="text-2xl font-bold text-gray-900">
          University Not Found
        </h1>
        <Button onClick={() => router.push("/admin/universities")}>
          <ArrowLeft size={14} />
          Back to Universities
        </Button>
      </div>
    );
  }

  const resources = content.filter((post) => post.post_type === "Resource");
  const questions = content.filter((post) => post.post_type === "Question");

  return (
    <div className="relative space-y-6 py-10">
      <div className="flex items-center gap-4">
        <button
          className="bg-white p-2 rounded-[5px] border border-gray-200 flex items-center gap-2 p-3 cursor-pointer"
          onClick={() => router.push("/admin/lookups")}
        >
          <ArrowLeft size={14} />
          Go Back
        </button>
        <div className="flex-1" />
        <button
          className="bg-white p-2 rounded-[5px] border border-gray-200 flex items-center gap-2 p-3 cursor-pointer"
          onClick={() => setIsEditDialogOpen(true)}
        >
          <Pencil size={14} />
          Edit University
        </button>
      </div>

      {university && (
        <>
          <div className="flex flex-col md:flex-row-reverse gap-3">
            <div className="sticky top-24 h-fit w-full md:w-1/3">
              <UniversityHeader university={university} />
            </div>

            <div className="flex flex-col gap-3 w-full md:w-2/3">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="bg-white p-4 rounded-md border border-gray-200">
                  <div className="text-sm font-medium text-gray-500">
                    Total Posts
                  </div>
                  <div className="text-2xl font-bold">{content.length}</div>
                </div>
                <div className="bg-white p-4 rounded-md border border-gray-200">
                  <div className="text-sm font-medium text-gray-500">
                    Resources
                  </div>
                  <div className="text-2xl font-bold">{resources.length}</div>
                </div>
                <div className="bg-white p-4 rounded-md border border-gray-200">
                  <div className="text-sm font-medium text-gray-500">
                    Questions
                  </div>
                  <div className="text-2xl font-bold">{questions.length}</div>
                </div>
              </div>

              <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
                <Tabs defaultValue="all" className="w-full">
                  <div className="p-4 border-b border-gray-200">
                    <TabsList>
                      <TabsTrigger value="all">
                        All Content ({content.length})
                      </TabsTrigger>
                      <TabsTrigger value="resources">
                        Resources ({resources.length})
                      </TabsTrigger>
                      <TabsTrigger value="questions">
                        Questions ({questions.length})
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="all" className="m-0">
                    {isContentLoading ? (
                      <div className="flex justify-center p-8">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                      </div>
                    ) : content.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        No content found.
                      </div>
                    ) : (
                      <div>
                        {content.map((post) => (
                          <PostItem key={post.id} post={post} />
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="resources" className="m-0">
                    {isContentLoading ? (
                      <div className="flex justify-center p-8">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                      </div>
                    ) : resources.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        No resources found.
                      </div>
                    ) : (
                      <div>
                        {resources.map((post) => (
                          <PostItem key={post.id} post={post} />
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="questions" className="m-0">
                    {isContentLoading ? (
                      <div className="flex justify-center p-8">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                      </div>
                    ) : questions.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        No questions found.
                      </div>
                    ) : (
                      <div>
                        {questions.map((post) => (
                          <PostItem key={post.id} post={post} />
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
          <CreateUniversityDialog
            open={isEditDialogOpen}
            setOpen={setIsEditDialogOpen}
            initialData={university}
            onSuccess={() => {
              // Reload university data
              getUniversity(university.id).then((res) => {
                if (res.success) setUniversity(res.data);
              });
            }}
          />
        </>
      )}
    </div>
  );
}
