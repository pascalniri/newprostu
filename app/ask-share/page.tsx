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
            <Input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setValue("file", file);
                }
              }}
              className="w-full"
            />
            {errors.file && (
              <p className="text-red-500 text-xs">{errors.file.message}</p>
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
