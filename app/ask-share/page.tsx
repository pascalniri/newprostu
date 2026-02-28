"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, FileText, UploadCloud, Video } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useSubmitQuestion,
  useTopics,
  useUniversities,
  useSchools,
  useCampuses,
  useGradeLevels,
} from "@/hooks";
import { Controller } from "react-hook-form";
import Navigation from "@/components/navigation";

export default function AskShare() {
  const router = useRouter();

  const { topics, isLoading: isLoadingTopics } = useTopics();
  const { universities, isLoading: isLoadingUniversities } = useUniversities();
  const { schools, isLoading: isLoadingSchools } = useSchools();
  const { campuses, isLoading: isLoadingCampuses } = useCampuses();
  const { gradeLevels, isLoading: isLoadingGradeLevels } = useGradeLevels();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    isSubmitting,
    errors,
    watch,
  } = useSubmitQuestion();

  return (
    <main className="flex flex-col w-full min-h-screen bg-[#F6F3ED] dark:bg-black font-sans">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col space-y-5">
        <Navigation />

        <div className="flex flex-col mb-4 mt-6 px-2">
          <h1 className="text-2xl md:text-[27px] font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Ask a public question
          </h1>

          {/* Informational Welcome Banner */}
          <div className="bg-[#EBF4FB] dark:bg-blue-900/20 border border-[#A6CEED] dark:border-blue-800 rounded p-6 w-full lg:w-2/3 mb-4">
            <h2 className="text-xl text-gray-800 dark:text-blue-100 font-normal mb-3">
              Writing a good question
            </h2>
            <p className="text-[15px] text-gray-800 dark:text-blue-200 mb-3">
              You’re ready to ask a programming-related question and this form
              will help guide you through the process.
            </p>
            <h5 className="font-semibold text-[13px] text-gray-800 dark:text-blue-200 mt-4 mb-1">
              Steps
            </h5>
            <ul className="list-disc pl-8 space-y-1 text-[13px] text-gray-800 dark:text-blue-200">
              <li>Summarize your problem in a one-line title.</li>
              <li>Describe your problem in more detail.</li>
              <li>Describe what you tried and what you expected to happen.</li>
              <li>Add tags which help surface your question.</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start px-2">
          {/* Form Column -> The actual Questions */}
          <div className="flex-[3] w-full min-w-0">
            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col gap-4"
            >
              {/* Box 1: Title & Type */}
              <div className="bg-white dark:bg-gray-900 border border-[#E5E7EB] dark:border-gray-800 rounded-sm p-6 flex flex-col gap-4 ">
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold text-[15px] text-gray-900 dark:text-gray-100">
                    Title
                  </h3>
                  <p className="text-[12px] text-gray-600 dark:text-gray-400">
                    Be specific and imagine you’re asking a question to another
                    person.
                  </p>
                  <Input
                    id="title"
                    type="text"
                    {...register("title")}
                    placeholder="e.g. Is there a CS study group for freshmen?"
                    className="mt-1"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1 mt-2">
                  <h3 className="font-semibold text-[15px] text-gray-900 dark:text-gray-100">
                    Post Type
                  </h3>
                  <p className="text-[12px] text-gray-600 dark:text-gray-400">
                    Are you asking a question or sharing a resource?
                  </p>
                  <div className="mt-1">
                    <Controller
                      name="postType"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full sm:w-1/2">
                            <SelectValue placeholder="Select type..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Question">Question</SelectItem>
                            <SelectItem value="Resource">Resource</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  {errors.postType && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.postType.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Box 2: Details / Body */}
              <div className="bg-white dark:bg-gray-900 border border-[#E5E7EB] dark:border-gray-800 rounded-sm p-6 flex flex-col gap-3  relative">
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold text-[15px] text-gray-900 dark:text-gray-100">
                    What are the details of your problem?
                  </h3>
                  <p className="text-[12px] text-gray-600 dark:text-gray-400">
                    Introduce the problem and expand on what you put in the
                    title. Minimum 20 characters.
                  </p>
                </div>

                <div className="border border-[#E5E7EB] dark:border-gray-700 rounded-sm focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 mt-2">
                  <div className="bg-gray-50 dark:bg-gray-800 border-b border-[#E5E7EB] dark:border-gray-700 p-2 flex gap-2">
                    <span className="w-6 h-6 flex items-center justify-center font-bold text-gray-600 text-sm hover:bg-gray-200 cursor-pointer rounded">
                      B
                    </span>
                    <span className="w-6 h-6 flex items-center justify-center italic text-gray-600 text-sm hover:bg-gray-200 cursor-pointer rounded">
                      I
                    </span>
                    <span className="w-6 h-6 flex items-center justify-center font-serif text-gray-600 text-sm hover:bg-gray-200 cursor-pointer rounded">
                      &ldquo;
                    </span>
                    <span className="w-6 h-6 flex items-center justify-center font-mono text-gray-600 text-sm hover:bg-gray-200 cursor-pointer rounded">
                      &lt;&gt;
                    </span>
                  </div>
                  <Textarea
                    {...register("details")}
                    placeholder="Share details and context..."
                    className="w-full min-h-[220px] p-4 bg-transparent resize-y border-none focus-visible:ring-0 text-[14px]"
                  />
                </div>
                {errors.details && (
                  <p className="text-red-500 text-xs">
                    {errors.details.message}
                  </p>
                )}
              </div>

              {/* Box 3: Meta Context (Uni, Campus, Tags) */}
              <div className="bg-white dark:bg-gray-900 border border-[#E5E7EB] dark:border-gray-800 rounded-sm p-6 flex flex-col ">
                <h3 className="font-semibold text-[15px] text-gray-900 dark:text-gray-100 mb-4">
                  Context & Tagging
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  {/* Col 1 */}
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="text-[13px] font-semibold text-gray-800 dark:text-gray-200 block mb-1">
                        University
                      </label>
                      <Controller
                        name="university"
                        control={control}
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={isLoadingUniversities}
                          >
                            <SelectTrigger className="w-full bg-white dark:bg-gray-800">
                              <SelectValue placeholder="Select University" />
                            </SelectTrigger>
                            <SelectContent>
                              {universities.map((u: any) => (
                                <SelectItem key={u.id} value={u.name}>
                                  {u.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <div>
                      <label className="text-[13px] font-semibold text-gray-800 dark:text-gray-200 block mb-1">
                        College / School
                      </label>
                      <Controller
                        name="school"
                        control={control}
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={isLoadingSchools}
                          >
                            <SelectTrigger className="w-full bg-white dark:bg-gray-800">
                              <SelectValue placeholder="Select School" />
                            </SelectTrigger>
                            <SelectContent>
                              {schools.map((s: any) => (
                                <SelectItem key={s.id} value={s.name}>
                                  {s.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <div>
                      <label className="text-[13px] font-semibold text-gray-800 dark:text-gray-200 block mb-1">
                        Campus
                      </label>
                      <Controller
                        name="campus"
                        control={control}
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={isLoadingCampuses}
                          >
                            <SelectTrigger className="w-full bg-white dark:bg-gray-800">
                              <SelectValue placeholder="Select Campus" />
                            </SelectTrigger>
                            <SelectContent>
                              {campuses.map((c: any) => (
                                <SelectItem key={c.id} value={c.name}>
                                  {c.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>

                  {/* Col 2 */}
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="text-[13px] font-semibold text-gray-800 dark:text-gray-200 block mb-1">
                        Topic
                      </label>
                      <Controller
                        name="topic"
                        control={control}
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={isLoadingTopics}
                          >
                            <SelectTrigger className="w-full bg-white dark:bg-gray-800">
                              <SelectValue placeholder="Select Topic" />
                            </SelectTrigger>
                            <SelectContent>
                              {topics.map((t: any) => (
                                <SelectItem key={t.id} value={t.name}>
                                  {t.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <div>
                      <label className="text-[13px] font-semibold text-gray-800 dark:text-gray-200 block mb-1">
                        Grade Level
                      </label>
                      <Controller
                        name="gradeLevel"
                        control={control}
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={isLoadingGradeLevels}
                          >
                            <SelectTrigger className="w-full bg-white dark:bg-gray-800">
                              <SelectValue placeholder="Select Grade" />
                            </SelectTrigger>
                            <SelectContent>
                              {gradeLevels.map((g: any) => (
                                <SelectItem key={g.id} value={g.name}>
                                  {g.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <div>
                      <label className="text-[13px] font-semibold text-gray-800 dark:text-gray-200 block mb-1">
                        Tags
                      </label>
                      <Input
                        {...register("tags")}
                        placeholder="e.g. (housing, scholarships)"
                        className="w-full bg-white dark:bg-gray-800"
                      />
                    </div>
                  </div>
                </div>

                {/* Identity */}
                <div className="mt-6 pt-6 border-t border-[#E5E7EB] dark:border-gray-800 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[13px] font-semibold text-gray-800 dark:text-gray-200 block mb-1">
                      Your Name (Optional)
                    </label>
                    <Input
                      {...register("yourName")}
                      placeholder="Anonymous"
                      className="bg-white dark:bg-gray-800"
                    />
                  </div>
                  <div>
                    <label className="text-[13px] font-semibold text-gray-800 dark:text-gray-200 block mb-1">
                      Your Primary School (Optional)
                    </label>
                    <Input
                      {...register("yourSchool")}
                      placeholder=""
                      className="bg-white dark:bg-gray-800"
                    />
                  </div>
                </div>
              </div>

              {/* Box 4: Attachments */}
              <div className="bg-white dark:bg-gray-900 border border-[#E5E7EB] dark:border-gray-800 rounded-sm p-6 flex flex-col ">
                <h3 className="font-semibold text-[15px] text-gray-900 dark:text-gray-100 mb-1">
                  Attachments
                </h3>
                <p className="text-[12px] text-gray-600 dark:text-gray-400 mb-4">
                  Add a link or upload screenshots/documents to support your
                  post.
                </p>

                <div className="flex flex-col gap-4">
                  <Input
                    {...register("linkUrl")}
                    placeholder="Add Link (optional)"
                    className="w-full sm:w-1/2 bg-white dark:bg-gray-800"
                  />

                  <div className="border border-dashed border-[#d6d9dc] dark:border-gray-600 rounded p-4 bg-gray-50/50 dark:bg-gray-800/30">
                    <Input
                      type="file"
                      multiple
                      id="file-upload"
                      className="hidden"
                      onChange={(e) => {
                        const newFiles = Array.from(e.target.files || []);
                        if (newFiles.length > 0) {
                          const currentFiles = (watch("files") as File[]) || [];
                          setValue("files", [...currentFiles, ...newFiles]);
                          e.target.value = "";
                        }
                      }}
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center gap-2 cursor-pointer py-2"
                    >
                      <UploadCloud className="w-6 h-6 text-gray-400" />
                      <div className="text-center">
                        <p className="text-[13px] font-medium text-blue-600 dark:text-blue-400">
                          Click to upload files
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Selected Files */}
                  {watch("files") && (watch("files") as File[]).length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {(watch("files") as File[]).map((file, index) => {
                        const isImage = file.type.startsWith("image/");
                        const isVideo = file.type.startsWith("video/");
                        const previewUrl = isImage
                          ? URL.createObjectURL(file)
                          : null;
                        return (
                          <div
                            key={index}
                            className="relative group border border-[#E5E7EB] dark:border-gray-700 rounded overflow-hidden"
                          >
                            <button
                              type="button"
                              onClick={() => {
                                const currentFiles =
                                  (watch("files") as File[]) || [];
                                setValue(
                                  "files",
                                  currentFiles.filter((_, i) => i !== index),
                                );
                              }}
                              className="absolute top-1 right-1 p-0.5 bg-black/60 text-white rounded-full z-10"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            <div className="aspect-square bg-gray-100 flex items-center justify-center">
                              {isImage && previewUrl ? (
                                <img
                                  src={previewUrl}
                                  alt=""
                                  className="w-full h-full object-cover"
                                  onLoad={() => URL.revokeObjectURL(previewUrl)}
                                />
                              ) : isVideo ? (
                                <Video className="w-6 h-6 text-gray-400" />
                              ) : (
                                <FileText className="w-6 h-6 text-gray-400" />
                              )}
                            </div>
                            <div className="px-2 py-1 bg-white dark:bg-gray-800 border-t border-[#E5E7EB] dark:border-gray-700">
                              <p className="text-[10px] truncate">
                                {file.name}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-2 mb-10">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#0A95FF] hover:bg-[#0074CC] text-white shadow-inner-sm border border-transparent px-3 py-2 h-auto"
                >
                  {isSubmitting ? "Submitting..." : "Post your question"}
                </Button>
              </div>
            </form>
          </div>

          {/* Right Sidebar - Helpful Info */}
          <section className="hidden lg:flex flex-col w-[300px] xl:w-[320px] shrink-0 space-y-4">
            <div className="bg-[#Fdf7e2] dark:bg-amber-900/10 border border-[#F1E5BC] dark:border-amber-700/30 rounded p-4  text-[13px] text-gray-800 dark:text-gray-300">
              <h4 className="font-semibold mb-2">
                Asking across universities?
              </h4>
              <p className="mb-2">
                If your question is relevant to multiple universities, you can
                leave the University tag completely blank! It will show up in
                the global feed.
              </p>
              <h4 className="font-semibold mb-2 mt-4">Tagging matters</h4>
              <p>
                Students follow specific tags like <code>housing</code> or{" "}
                <code>financial-aid</code>. Tagging correctly means faster
                answers.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
