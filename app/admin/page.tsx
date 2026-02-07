"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/ui/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Submission } from "@/types/database";

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUniversities, setSelectedUniversities] = useState<{
    [key: string]: string;
  }>({});

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch("/api/submissions");
      const data = await response.json();
      if (data.success) {
        setSubmissions(data.submissions);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproval = async (
    submissionId: string,
    action: "approve" | "reject",
  ) => {
    try {
      const university = selectedUniversities[submissionId] || "UMich";

      const response = await fetch("/api/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          submissionId,
          action,
          university: action === "approve" ? university : undefined,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Remove the submission from the list
        setSubmissions(submissions.filter((sub) => sub.id !== submissionId));
        alert(result.message);
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Approval error:", error);
      alert("An error occurred");
    }
  };

  return (
    <div className="bg-[#00274C] min-h-screen">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
          Admin Dashboard
        </h1>

        {isLoading ? (
          <div className="text-white text-center py-12">
            Loading submissions...
          </div>
        ) : submissions.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center">
            <p className="text-gray-600 dark:text-gray-300">
              No pending submissions
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {submission.title}
                    </h3>
                    <div className="flex gap-2 flex-wrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          submission.post_type === "Question"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                            : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        }`}
                      >
                        {submission.post_type}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                        {submission.topic}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-xs">
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      School:
                    </span>{" "}
                    <span className="text-gray-600 dark:text-gray-400">
                      {submission.school}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      Campus:
                    </span>{" "}
                    <span className="text-gray-600 dark:text-gray-400">
                      {submission.campus}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      Grade Level:
                    </span>{" "}
                    <span className="text-gray-600 dark:text-gray-400">
                      {submission.grade_level}
                    </span>
                  </div>
                  {submission.author_name && (
                    <div>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        Author:
                      </span>{" "}
                      <span className="text-gray-600 dark:text-gray-400">
                        {submission.author_name}
                      </span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {submission.details}
                  </p>
                </div>

                {/* Tags */}
                {submission.tags && submission.tags.length > 0 && (
                  <div className="mb-4">
                    <div className="flex gap-2 flex-wrap">
                      {submission.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Attachment */}
                {submission.attachment_url && (
                  <div className="mb-4">
                    <a
                      href={submission.attachment_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline text-xs"
                    >
                      {submission.attachment_type === "file"
                        ? `📎 ${submission.attachment_filename}`
                        : `🔗 ${submission.attachment_url}`}
                    </a>
                  </div>
                )}

                {/* Admin Actions */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Select
                    value={selectedUniversities[submission.id] || "UMich"}
                    onValueChange={(value) =>
                      setSelectedUniversities({
                        ...selectedUniversities,
                        [submission.id]: value,
                      })
                    }
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select university" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UMich">
                        University of Michigan
                      </SelectItem>
                      <SelectItem value="Harvard">
                        Harvard University
                      </SelectItem>
                      <SelectItem value="Stanford">
                        Stanford University
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="default"
                    onClick={() => handleApproval(submission.id, "approve")}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Approve
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={() => handleApproval(submission.id, "reject")}
                  >
                    Reject
                  </Button>
                </div>

                {/* Metadata */}
                <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                  Submitted: {new Date(submission.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
