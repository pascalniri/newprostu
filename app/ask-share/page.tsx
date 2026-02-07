"use client";

import { useState } from "react";
import Navigation from "@/components/ui/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AskShare() {
  const [formData, setFormData] = useState({
    title: "",
    postType: "Question",
    topic: "",
    school: "",
    campus: "",
    gradeLevel: "",
    details: "",
    yourName: "",
    yourSchool: "",
    tags: "",
    linkUrl: "",
    file: null as File | null,
  });

  const [showLinkInput, setShowLinkInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const topics = [
    "Mathematics",
    "Chemistry",
    "Physics",
    "Biology",
    "Computer Science",
    "Engineering",
    "Literature",
    "History",
    "Economics",
    "Other",
  ];

  const schools = [
    "College of Engineering",
    "College of Literature, Science, and the Arts",
    "Ross School of Business",
    "School of Information",
    "School of Public Health",
    "School of Education",
    "Other",
  ];

  const campuses = [
    "North Campus",
    "Central Campus",
    "Medical Campus",
    "Athletic Campus",
  ];

  const gradeLevels = ["Freshman", "Sophomore", "Junior", "Senior", "Graduate"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("postType", formData.postType);
      submitData.append("topic", formData.topic);
      submitData.append("school", formData.school);
      submitData.append("campus", formData.campus);
      submitData.append("gradeLevel", formData.gradeLevel);
      submitData.append("details", formData.details);
      submitData.append("yourName", formData.yourName);
      submitData.append("yourSchool", formData.yourSchool);
      submitData.append("tags", formData.tags);

      if (formData.linkUrl) {
        submitData.append("linkUrl", formData.linkUrl);
      }

      if (formData.file) {
        submitData.append("file", formData.file);
      }

      const response = await fetch("/api/submissions", {
        method: "POST",
        body: submitData,
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus({
          type: "success",
          message: result.message,
        });

        // Reset form
        setFormData({
          title: "",
          postType: "Question",
          topic: "",
          school: "",
          campus: "",
          gradeLevel: "",
          details: "",
          yourName: "",
          yourSchool: "",
          tags: "",
          linkUrl: "",
          file: null,
        });
        setShowLinkInput(false);
      } else {
        setSubmitStatus({
          type: "error",
          message: result.message || "Submission failed. Please try again.",
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus({
        type: "error",
        message:
          "An error occurred. Please check your internet connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, file: e.target.files[0] });
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

        {/* Success/Error Message */}
        {submitStatus.type && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              submitStatus.type === "success"
                ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-300 dark:border-green-700"
                : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-700"
            }`}
          >
            {submitStatus.message}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl"
        >
          {/* Title and Post Type Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Select
                value={formData.postType}
                onValueChange={(value) =>
                  setFormData({ ...formData, postType: value })
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
            </div>
          </div>

          {/* Topic and School Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <Select
                value={formData.topic}
                onValueChange={(value) =>
                  setFormData({ ...formData, topic: value })
                }
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Topic" />
                </SelectTrigger>
                <SelectContent>
                  {topics.map((topic) => (
                    <SelectItem key={topic} value={topic}>
                      {topic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Select
                value={formData.school}
                onValueChange={(value) =>
                  setFormData({ ...formData, school: value })
                }
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="School" />
                </SelectTrigger>
                <SelectContent>
                  {schools.map((school) => (
                    <SelectItem key={school} value={school}>
                      {school}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Campus and Grade Level Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <Select
                value={formData.campus}
                onValueChange={(value) =>
                  setFormData({ ...formData, campus: value })
                }
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Campus" />
                </SelectTrigger>
                <SelectContent>
                  {campuses.map((campus) => (
                    <SelectItem key={campus} value={campus}>
                      {campus}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Select
                value={formData.gradeLevel}
                onValueChange={(value) =>
                  setFormData({ ...formData, gradeLevel: value })
                }
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Grade level" />
                </SelectTrigger>
                <SelectContent>
                  {gradeLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Details Textarea */}
          <div className="mb-6">
            <Textarea
              placeholder="Share details and context"
              value={formData.details}
              onChange={(e) =>
                setFormData({ ...formData, details: e.target.value })
              }
              rows={6}
              required
              disabled={isSubmitting}
              className="resize-none"
            />
          </div>

          {/* Your Name and Your School Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Your name (optional)"
                value={formData.yourName}
                onChange={(e) =>
                  setFormData({ ...formData, yourName: e.target.value })
                }
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Your school (optional)"
                value={formData.yourSchool}
                onChange={(e) =>
                  setFormData({ ...formData, yourSchool: e.target.value })
                }
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Tags */}
          <div className="mb-8">
            <Input
              type="text"
              placeholder="Tags (comma-separated)"
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
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
                  <Input
                    type="url"
                    placeholder="Enter URL (https://...)"
                    value={formData.linkUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, linkUrl: e.target.value })
                    }
                    disabled={isSubmitting}
                  />
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
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {formData.file ? formData.file.name : "No file chosen"}
                </span>
              </div>
            </div>
          </div>

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
