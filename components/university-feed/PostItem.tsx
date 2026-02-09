"use client";

import { useState } from "react";
import {
  Calendar,
  FileText,
  Link as LinkIcon,
  MessageSquare,
  User,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { ApprovedContent } from "@/types/database";
import CommentSection from "./CommentSection";

interface PostItemProps {
  post: ApprovedContent;
}

export default function PostItem({ post }: PostItemProps) {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  post.post_type === "Question"
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                    : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                }`}
              >
                {post.post_type}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                • {post.topic}
              </span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {post.title}
            </h3>
          </div>

          <div className="text-right text-xs text-gray-500 dark:text-gray-400">
            {formatDistanceToNow(
              new Date(post.approved_at || post.created_at),
              { addSuffix: true },
            )}
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-6 whitespace-pre-wrap">
          {post.details}
        </p>

        {/* Attachment */}
        {(post.attachment_url || post.attachment_type) && (
          <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-gray-700 flex items-center gap-3">
            {post.attachment_type === "link" ? (
              <LinkIcon className="w-5 h-5 text-blue-500" />
            ) : (
              <FileText className="w-5 h-5 text-orange-500" />
            )}
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate text-gray-900 dark:text-white">
                {post.attachment_filename || "Attachment"}
              </p>
              {post.attachment_type === "link" && post.attachment_url && (
                <a
                  href={post.attachment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline truncate block"
                >
                  {post.attachment_url}
                </a>
              )}
            </div>
            {post.attachment_type !== "link" && post.attachment_url && (
              <a
                href={post.attachment_url}
                download
                className="text-xs font-medium text-blue-600 hover:text-blue-700 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
              >
                Download
              </a>
            )}
          </div>
        )}

        {/* Footer info */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              <span>{post.author_name || "Anonymous"}</span>
            </div>
            <div>{post.author_school && <span>{post.author_school}</span>}</div>
          </div>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Comments</span>
          </button>
        </div>
      </div>

      {showComments && (
        <div className="bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 p-6">
          <CommentSection contentId={post.id} />
        </div>
      )}
    </div>
  );
}
