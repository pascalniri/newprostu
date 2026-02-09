"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSubmissions } from "@/hooks/useSubmissions";
import type { Submission } from "@/types/database";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Link as LinkIcon, Calendar } from "lucide-react";
import { AdminNav } from "@/components/admin-nav";
import useMe from "@/hooks/useMe";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface SubmissionDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function SubmissionDetailPage({
  params,
}: SubmissionDetailPageProps) {
  const router = useRouter();
  const {
    getSingleSubmission,
    isLoading,
    approveSubmission,
    rejectSubmission,
  } = useSubmissions();
  const { user, loadingMe, getUser } = useMe();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [selectedUniversity, setSelectedUniversity] = useState<string>("");
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setSubmissionId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    const fetchSubmission = async () => {
      if (submissionId) {
        const data = await getSingleSubmission(submissionId);
        if (data) {
          setSubmission(data);
        } else {
          setError("Submission not found");
        }
      }
    };

    fetchSubmission();
  }, [submissionId]);

  const handleApprove = async () => {
    if (!submissionId || !selectedUniversity) return;

    setIsApproving(true);
    const result = await approveSubmission(submissionId, selectedUniversity);
    setIsApproving(false);

    if (result.success) {
      router.push("/admin");
    }
  };

  const handleReject = async () => {
    if (!submissionId) return;

    setIsRejecting(true);
    const result = await rejectSubmission(submissionId);
    setIsRejecting(false);

    if (result.success) {
      router.push("/admin");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-5 w-full py-5 px-4">
        <AdminNav user={user} loadingMe={loadingMe} getUser={getUser} />

        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-[180px]" />
        </div>

        {/* Main Content Skeleton */}
        <section className="w-full bg-white flex flex-col gap-6 items-start justify-center px-6 py-6 rounded-lg border border-[#E5E7EB]">
          {/* Title and Badges Skeleton */}
          <div className="w-full border-b border-[#E5E7EB] pb-4">
            <Skeleton className="h-8 w-3/4 mb-3" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 rounded" />
              <Skeleton className="h-6 w-20 rounded" />
            </div>
          </div>

          {/* Details Grid Skeleton */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col gap-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-32" />
              </div>
            ))}
          </div>

          {/* Details Section Skeleton */}
          <div className="w-full">
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>

          {/* Tags Skeleton */}
          <div className="w-full">
            <Skeleton className="h-4 w-12 mb-2" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded" />
              <Skeleton className="h-6 w-20 rounded" />
              <Skeleton className="h-6 w-14 rounded" />
            </div>
          </div>

          {/* Timestamps Skeleton */}
          <div className="w-full border-t border-[#E5E7EB] pt-4 flex items-center gap-4">
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-3 w-40" />
          </div>
        </section>

        {/* Actions Section Skeleton */}
        <section className="w-full bg-white flex flex-col gap-4 items-start justify-center px-6 py-6 rounded-lg border border-[#E5E7EB]">
          <Skeleton className="h-6 w-24" />
          <div className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-10 w-full md:w-[300px]" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-10 w-[160px]" />
              <Skeleton className="h-10 w-[150px]" />
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col space-y-5 w-full py-5 px-4">
        <AdminNav user={user} loadingMe={loadingMe} getUser={getUser} />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="text-lg text-red-600">{error}</div>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="flex flex-col space-y-5 w-full py-5 px-4">
        <AdminNav user={user} loadingMe={loadingMe} getUser={getUser} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-lg text-gray-500">No submission found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-5 w-full py-5 px-4">
      <AdminNav user={user} loadingMe={loadingMe} getUser={getUser} />

      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="gap-2"
        >
          <ArrowLeft size={16} />
          Back to Submissions
        </Button>
      </div>

      {/* Main Content Section */}
      <section className="w-full bg-white flex flex-col gap-6 items-start justify-center px-6 py-6 rounded-lg border border-[#E5E7EB]">
        {/* Title and Badges */}
        <div className="w-full border-b border-[#E5E7EB] pb-4">
          <h1 className="text-2xl font-bold mb-3">{submission.title}</h1>
          <div className="flex flex-wrap gap-2">
            <span
              className={`px-3 py-1 rounded text-xs font-medium ${
                submission.post_type === "Question"
                  ? "bg-blue-500 text-white"
                  : "bg-orange-500 text-white"
              }`}
            >
              {submission.post_type}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
              {submission.status}
            </span>
          </div>
        </div>

        {/* Submission Details Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1">
            <h3 className=" font-semibold text-gray-500">Topic</h3>
            <p className="text-sm text-gray-900">{submission.topic}</p>
          </div>

          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-gray-500">School</h3>
            <p className="text-sm text-gray-900">{submission.school}</p>
          </div>

          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-gray-500">Campus</h3>
            <p className="text-sm text-gray-900">{submission.campus}</p>
          </div>

          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-gray-500">Grade Level</h3>
            <p className="text-sm text-gray-900">{submission.grade_level}</p>
          </div>

          {submission.author_name && (
            <div className="flex flex-col gap-1">
              <h3 className="font-semibold text-gray-500">Author Name</h3>
              <p className="text-sm text-gray-900">{submission.author_name}</p>
            </div>
          )}

          {submission.author_school && (
            <div className="flex flex-col gap-1">
              <h3 className="font-semibold text-gray-500">Author School</h3>
              <p className="text-sm text-gray-900">
                {submission.author_school}
              </p>
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="w-full">
          <h3 className="font-semibold text-gray-500 mb-2">Details</h3>
          <div className="bg-gray-50 p-4 rounded-lg border border-[#E5E7EB]">
            <p className="text-sm text-gray-900 whitespace-pre-wrap">
              {submission.details}
            </p>
          </div>
        </div>

        {/* Tags */}
        {submission.tags && submission.tags.length > 0 && (
          <div className="w-full">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {submission.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-100 text-purple-800 rounded text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Attachment */}
        {submission.attachment_url && (
          <div className="w-full">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">
              Attachment
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-[#E5E7EB] flex items-start gap-3">
              {submission.attachment_type === "file" ? (
                <FileText className="h-5 w-5 text-gray-600 mt-0.5" />
              ) : (
                <LinkIcon className="h-5 w-5 text-gray-600 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">
                  Type:{" "}
                  <span className="font-medium">
                    {submission.attachment_type}
                  </span>
                </p>
                {submission.attachment_filename && (
                  <p className="text-sm text-gray-600 mb-2">
                    File:{" "}
                    <span className="font-medium">
                      {submission.attachment_filename}
                    </span>
                  </p>
                )}
                <a
                  href={submission.attachment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-medium underline"
                >
                  View Attachment
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="w-full border-t border-[#E5E7EB] pt-4 flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>
              Created: {new Date(submission.created_at).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>
              Updated: {new Date(submission.updated_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </section>

      {/* Actions Section */}
      <section className="w-full bg-white flex flex-col gap-4 items-start justify-center px-6 py-6 rounded-lg border border-[#E5E7EB]">
        <h2 className="text-lg font-semibold">Actions</h2>

        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Select University (required for approval)
            </label>
            <Select
              value={selectedUniversity}
              onValueChange={setSelectedUniversity}
            >
              <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue placeholder="Select university" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Harvard">Harvard</SelectItem>
                <SelectItem value="Stanford">Stanford</SelectItem>
                <SelectItem value="UMich">UMich</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleApprove}
              disabled={!selectedUniversity || isApproving}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              {isApproving ? "Approving..." : "Approve Submission"}
            </Button>
            <Button
              onClick={handleReject}
              disabled={isRejecting}
              variant="destructive"
            >
              {isRejecting ? "Rejecting..." : "Reject Submission"}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
