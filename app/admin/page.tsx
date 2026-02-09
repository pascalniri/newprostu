"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSubmissions } from "@/hooks";
import { AdminNav } from "@/components/admin-nav";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import formatDate from "@/lib/utils/date-formatter";
import useMe from "@/hooks/useMe";

export default function AdminDashboard() {
  const router = useRouter();
  const { isLoading, submissions, approveSubmission, rejectSubmission } =
    useSubmissions();
  const { user, loadingMe, getUser } = useMe();

  return (
    <div className="flex flex-col space-y-5 w-full py-5 px-4">
      <AdminNav user={user} loadingMe={loadingMe} getUser={getUser} />

      {/* Submissions Table Section */}
      <section className="w-full bg-white flex flex-col gap-4 items-start justify-center px-6 py-6 rounded-lg border border-[#E5E7EB]">
        <div className="w-full flex items-center justify-between">
          <h2 className="text-lg font-semibold">Pending Submissions</h2>
          <span className="text-xs text-gray-600">
            {submissions.length} pending
          </span>
        </div>

        {isLoading ? (
          <div className="w-full border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Title</TableHead>
                  <TableHead className="font-semibold">Type</TableHead>
                  <TableHead className="font-semibold">Topic</TableHead>
                  <TableHead className="font-semibold">School</TableHead>
                  <TableHead className="font-semibold">Submitted</TableHead>
                  <TableHead className="font-semibold">University</TableHead>
                  <TableHead className="font-semibold text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-[200px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-[80px] rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[150px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Skeleton className="h-8 w-[70px]" />
                        <Skeleton className="h-8 w-[70px]" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : submissions.length === 0 ? (
          <div className="w-full text-center py-12 text-gray-500">
            No pending submissions
          </div>
        ) : (
          <div className="w-full border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Title</TableHead>
                  <TableHead className="font-semibold">Type</TableHead>
                  <TableHead className="font-semibold">Topic</TableHead>
                  <TableHead className="font-semibold">School</TableHead>
                  <TableHead className="font-semibold">Submitted</TableHead>
                  <TableHead className="font-semibold">University</TableHead>
                  <TableHead className="font-semibold text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow
                    key={submission.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() =>
                      router.push(`/admin/submissions/${submission.id}`)
                    }
                  >
                    <TableCell className="font-medium max-w-xs truncate">
                      {submission.title}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          submission.post_type === "Question"
                            ? "bg-blue-500 text-white"
                            : "bg-orange-500 text-white"
                        }`}
                      >
                        {submission.post_type}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-gray-600">
                      {submission.topic}
                    </TableCell>
                    <TableCell className="text-xs text-gray-600 max-w-xs truncate">
                      {submission.school}
                    </TableCell>
                    <TableCell className="text-xs text-gray-500">
                      {formatDate(submission.created_at)}
                    </TableCell>
                    <TableCell className="text-xs text-gray-600">
                      {submission.university || "Not Available"}
                    </TableCell>
                    <TableCell
                      className="text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          className="bg-green-500 hover:bg-green-600 text-white h-8 px-3 text-xs"
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-8 px-3 text-xs"
                        >
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </section>
    </div>
  );
}
