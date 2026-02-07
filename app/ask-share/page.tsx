"use client";

import { useState } from "react";
import Navigation from "@/components/ui/navigation";
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
import useSubmitQuestion from "@/hooks/useSubmitQuestion";
import { useDropdowns } from "@/hooks/useDropdowns";

export default function AskShare() {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Use the submission hook
  const {
    register,
    formState: { errors },
    setValue,
    watch,
    onSubmit,
    isSubmitting,
    uploadProgress,
  } = useSubmitQuestion();

  // Fetch dropdown data
  const {
    topics,
    schools,
    campuses,
    gradeLevels,
    isLoading: dropdownsLoading,
  } = useDropdowns();

  const postType = watch("postType");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setValue("file", file);
    }
  };

  return (
    <div className="bg-[#00274C] min-h-screen">
      <Navigation />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Ask a Question or Share a Resource
          </h1>
        </div>

        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl"
        >
          {/* Title and Post Type Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Title"
                {...register("title")}
                disabled={isSubmitting}
              />
              {errors.title && (
                <p className="text-xs text-red-600">{errors.title.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Select
                value={postType}
                onValueChange={(value) =>
                  setValue("postType", value as "Question" | "Resource")
                }
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Question">Question</SelectItem>
                  <SelectItem value="Resource">Resource</SelectItem>
                </SelectContent>
              </Select>
              {errors.postType && (
                <p className="text-xs text-red-600">
                  {errors.postType.message}
                </p>
              )}
            </div>
          </div>

          {/* Topic and School Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <Select
                value={watch("topic")}
                onValueChange={(value) => setValue("topic", value)}
                disabled={isSubmitting || dropdownsLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Topic" />
                </SelectTrigger>
                <SelectContent>
                  {topics.map((topic) => (
                    <SelectItem key={topic.id} value={topic.name}>
                      {topic.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.topic && (
                <p className="text-xs text-red-600">{errors.topic.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Select
                value={watch("school")}
                onValueChange={(value) => setValue("school", value)}
                disabled={isSubmitting || dropdownsLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="School" />
                </SelectTrigger>
                <SelectContent>
                  {schools.map((school) => (
                    <SelectItem key={school.id} value={school.name}>
                      {school.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.school && (
                <p className="text-xs text-red-600">{errors.school.message}</p>
              )}
            </div>
          </div>

          {/* Campus and Grade Level Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <Select
                value={watch("campus")}
                onValueChange={(value) => setValue("campus", value)}
                disabled={isSubmitting || dropdownsLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Campus" />
                </SelectTrigger>
                <SelectContent>
                  {campuses.map((campus) => (
                    <SelectItem key={campus.id} value={campus.name}>
                      {campus.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.campus && (
                <p className="text-xs text-red-600">{errors.campus.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Select
                value={watch("gradeLevel")}
                onValueChange={(value) => setValue("gradeLevel", value)}
                disabled={isSubmitting || dropdownsLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Grade level" />
                </SelectTrigger>
                <SelectContent>
                  {gradeLevels.map((level) => (
                    <SelectItem key={level.id} value={level.name}>
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.gradeLevel && (
                <p className="text-xs text-red-600">
                  {errors.gradeLevel.message}
                </p>
              )}
            </div>
          </div>

          {/* Details Textarea */}
          <div className="mb-6">
            <Textarea
              placeholder="Share details and context"
              {...register("details")}
              rows={6}
              disabled={isSubmitting}
              className="resize-none"
            />
            {errors.details && (
              <p className="text-xs text-red-600 mt-1">
                {errors.details.message}
              </p>
            )}
          </div>

          {/* Your Name and Your School Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Your name (optional)"
                {...register("yourName")}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Your school (optional)"
                {...register("yourSchool")}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Tags */}
          <div className="mb-8">
            <Input
              type="text"
              placeholder="Tags (comma-separated)"
              {...register("tags")}
              disabled={isSubmitting}
            />
          </div>

          {/* Attachments */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Attachments
            </h3>
            <div className="space-y-4">
              {/* Add Link Button and Input */}
              <div>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowLinkInput(!showLinkInput)}
                  className="mb-3"
                  disabled={isSubmitting}
                >
                  {showLinkInput ? "Hide Link" : "Add Link"}
                </Button>
                {showLinkInput && (
                  <div>
                    <Input
                      type="url"
                      placeholder="Enter URL (https://...)"
                      {...register("linkUrl")}
                      disabled={isSubmitting}
                    />
                    {errors.linkUrl && (
                      <p className="text-xs text-red-600 mt-1">
                        {errors.linkUrl.message}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* File Upload */}
              <div className="flex items-center gap-4">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    disabled={isSubmitting}
                  />
                  <span className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer inline-block">
                    Choose File
                  </span>
                </label>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {selectedFile ? selectedFile.name : "No file chosen"}
                </span>
              </div>
            </div>
          </div>

          {/* Upload Progress */}
          {isSubmitting && uploadProgress > 0 && (
            <div className="mb-6">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-[#FFCB05] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 text-center">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <Button
              type="submit"
              variant="default"
              size="lg"
              className="w-full md:w-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit for Approval"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
