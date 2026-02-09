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
import {
  X,
  FileText,
  Image as ImageIcon,
  UploadCloud,
  Video,
} from "lucide-react";
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
    uploadProgress,
    isSubmitting,
    errors,
    watch,
  } = useSubmitQuestion();

  return (
    <main className="flex flex-col space-y-5 w-full py-5">
      {/* Header Section */}
      <Navigation />

      {/* Form Section */}
      <section className="w-full bg-white flex flex-col gap-6 items-start justify-center px-6 py-8 rounded-lg border border-[#E5E7EB]">
        <h2 className="text-lg font-bold">
          Ask a Question or Share a Resource
        </h2>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {/* Row 1: Title and Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Input
                id="title"
                type="text"
                {...register("title")}
                placeholder="Title"
                className="w-full"
              />
              {errors.title && (
                <p className="text-red-500 text-xs">{errors.title.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Controller
                name="postType"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Question">Question</SelectItem>
                      <SelectItem value="Resource">Resource</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.postType && (
                <p className="text-red-500 text-xs">
                  {errors.postType.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 2: Topic and University */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Controller
                name="topic"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoadingTopics}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={isLoadingTopics ? "Loading..." : "Topic"}
                      />
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
              {errors.topic && (
                <p className="text-red-500 text-xs">{errors.topic.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Controller
                name="university"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoadingUniversities}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          isLoadingUniversities ? "Loading..." : "University"
                        }
                      />
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
          </div>

          {/* Row 3: College/School and Campus */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Controller
                name="school"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoadingSchools}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          isLoadingSchools ? "Loading..." : "College / School"
                        }
                      />
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
              {errors.school && (
                <p className="text-red-500 text-xs">{errors.school.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Controller
                name="campus"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoadingCampuses}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          isLoadingCampuses ? "Loading..." : "Campus"
                        }
                      />
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
              {errors.campus && (
                <p className="text-red-500 text-xs">{errors.campus.message}</p>
              )}
            </div>
          </div>

          {/* Row 4: Grade Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Controller
                name="gradeLevel"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoadingGradeLevels}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          isLoadingGradeLevels ? "Loading..." : "Grade level"
                        }
                      />
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
              {errors.gradeLevel && (
                <p className="text-red-500 text-xs">
                  {errors.gradeLevel.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 5: Share details and context */}
          <div className="flex flex-col gap-2">
            <Textarea
              {...register("details")}
              placeholder="Share details and context"
              className="w-full min-h-32"
            />
            {errors.details && (
              <p className="text-red-500 text-xs">{errors.details.message}</p>
            )}
          </div>

          {/* Row 6: Your name and Your school (optional) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Input
                {...register("yourName")}
                placeholder="Your name (optional)"
                className="w-full"
              />
              {errors.yourName && (
                <p className="text-red-500 text-xs">
                  {errors.yourName.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Input
                {...register("yourSchool")}
                placeholder="Your school (optional)"
                className="w-full"
              />
              {errors.yourSchool && (
                <p className="text-red-500 text-xs">
                  {errors.yourSchool.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 7: Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Input
                {...register("tags")}
                placeholder="Tags (comma-separated)"
                className="w-full"
              />
              {errors.tags && (
                <p className="text-red-500 text-xs">{errors.tags.message}</p>
              )}
            </div>
          </div>

          {/* Attachments */}
          <div className="flex flex-col gap-3">
            <h4 className="text-lg font-semibold">Attachments</h4>
            <Input
              {...register("linkUrl")}
              placeholder="Add Link (optional)"
              className="w-full"
            />
            {/* File Input Area */}
            <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4 transition-colors hover:border-gray-300 dark:hover:border-gray-600">
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
                    e.target.value = ""; // Reset input
                  }
                }}
              />
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center gap-2 cursor-pointer py-4"
              >
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                  <UploadCloud className="w-6 h-6 text-blue-500" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Click to upload documents or images
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Up to 50MB per file
                  </p>
                </div>
              </label>
            </div>

            {/* Selected Files List */}
            {watch("files") && (watch("files") as File[]).length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                {(watch("files") as File[]).map((file, index) => {
                  const isImage = file.type.startsWith("image/");
                  const isVideo = file.type.startsWith("video/");
                  const previewUrl = isImage ? URL.createObjectURL(file) : null;

                  return (
                    <div
                      key={index}
                      className="relative group border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800"
                    >
                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => {
                          const currentFiles = (watch("files") as File[]) || [];
                          const newFiles = currentFiles.filter(
                            (_, i) => i !== index,
                          );
                          setValue("files", newFiles);
                        }}
                        className="absolute top-1.5 right-1.5 p-1 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      {/* Preview / Icon */}
                      <div className="aspect-square flex items-center justify-center bg-gray-100 dark:bg-gray-700/50">
                        {isImage && previewUrl ? (
                          <img
                            src={previewUrl}
                            alt={file.name}
                            className="w-full h-full object-cover"
                            onLoad={() => URL.revokeObjectURL(previewUrl)}
                          />
                        ) : isVideo ? (
                          <div className="flex flex-col items-center gap-2 text-gray-400">
                            <Video className="w-8 h-8" />
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-gray-400">
                            <FileText className="w-8 h-8" />
                          </div>
                        )}
                      </div>

                      {/* File Info */}
                      <div className="p-2 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                        <p className="text-xs font-medium truncate text-gray-700 dark:text-gray-300">
                          {file.name}
                        </p>
                        <p className="text-[10px] text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(1)} MB
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {errors.files && (
              <p className="text-red-500 text-xs">
                {String(errors.files.message)}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="tertiary"
            className="w-full md:w-auto px-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit for Approval"}
          </Button>
        </form>
      </section>
    </main>
  );
}
