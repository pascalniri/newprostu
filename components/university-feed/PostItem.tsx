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
import PostModal from "./PostModal";

interface PostItemProps {
  post: ApprovedContent;
}

const isImage = (filename?: string | null) => {
  if (!filename) return false;
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(filename);
};

const isVideo = (filename?: string | null) => {
  if (!filename) return false;
  return /\.(mp4|mov|webm)$/i.test(filename);
};

const parseAttachments = (url: string | null, filename: string | null) => {
  if (!url) return [];
  try {
    const parsedUrls = JSON.parse(url);
    const parsedFilenames = filename ? JSON.parse(filename) : [];
    if (Array.isArray(parsedUrls)) {
      return parsedUrls.map((u, i) => ({
        url: u,
        filename: parsedFilenames[i] || "Attachment",
      }));
    }
    // If JSON parse succeeds but not array (unlikely given our backend), fallback
    return [{ url, filename: filename || "Attachment" }];
  } catch (e) {
    // Not JSON, assume single string (legacy)
    return [{ url, filename: filename || "Attachment" }];
  }
};

export default function PostItem({ post }: PostItemProps) {
  const [showComments, setShowComments] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
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
        {/* Attachment */}
        {(post.attachment_url || post.attachment_type) && (
          <div className="mb-4 space-y-3">
            {post.attachment_type === "link" ? (
              // Link Preview
              <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-gray-700 flex items-center gap-3">
                <LinkIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <div className="flex-1 overflow-hidden">
                  <p className=" font-medium truncate text-gray-900 dark:text-white">
                    {post.attachment_filename || "Link Attachment"}
                  </p>
                  {post.attachment_url && (
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
              </div>
            ) : (
              // Handle Multiple Attachments (Grid for Media, List for Files)
              (() => {
                const attachments = parseAttachments(
                  post.attachment_url,
                  post.attachment_filename,
                );
                const mediaAttachments = attachments.filter(
                  (a) => isImage(a.filename) || isVideo(a.filename),
                );
                const fileAttachments = attachments.filter(
                  (a) => !isImage(a.filename) && !isVideo(a.filename),
                );

                return (
                  <>
                    {/* Media Layout - Threads Style */}
                    {mediaAttachments.length > 0 && (
                      <div
                        className={`overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 ${
                          mediaAttachments.length === 1 ? "" : "flex h-[300px]"
                        }`}
                      >
                        {mediaAttachments.map((file, index) => {
                          return (
                            <div
                              key={`media-${index}`}
                              className={`relative bg-gray-100 dark:bg-gray-900 ${
                                mediaAttachments.length === 1
                                  ? "w-full"
                                  : "flex-1 border-r border-white/20 last:border-r-0"
                              }`}
                            >
                              {isVideo(file.filename) ? (
                                <div
                                  onClick={() => {
                                    setModalIndex(index);
                                    setModalOpen(true);
                                  }}
                                  className="w-full h-full cursor-pointer"
                                >
                                  <video
                                    src={file.url}
                                    className={`w-full h-full object-cover block ${
                                      mediaAttachments.length === 1
                                        ? "max-h-[600px] aspect-auto"
                                        : ""
                                    }`}
                                  />
                                  {/* Play Icon Overlay */}
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/20 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                                      <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1" />
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <img
                                  src={file.url}
                                  alt={file.filename}
                                  onClick={() => {
                                    setModalIndex(index);
                                    setModalOpen(true);
                                  }}
                                  className={`w-full h-full object-cover block cursor-pointer ${
                                    mediaAttachments.length === 1
                                      ? "max-h-[600px] aspect-auto"
                                      : ""
                                  }`}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* File Attachments List */}
                    {fileAttachments.length > 0 && (
                      <div className="space-y-2">
                        {fileAttachments.map((file, index) => (
                          <div
                            key={`file-${index}`}
                            className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-gray-700 flex items-center gap-3"
                          >
                            <FileText className="w-5 h-5 text-orange-500 flex-shrink-0" />
                            <div className="flex-1 overflow-hidden">
                              <p className=" font-medium truncate text-gray-900 dark:text-white">
                                {file.filename}
                              </p>
                            </div>
                            <a
                              href={file.url}
                              download
                              className="text-xs font-medium text-blue-600 hover:text-blue-700 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors whitespace-nowrap"
                            >
                              Download
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                );
              })()
            )}
          </div>
        )}

        {/* Footer info */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4  text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              <span>{post.author_name || "Anonymous"}</span>
            </div>
            <div>{post.author_school && <span>{post.author_school}</span>}</div>
          </div>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5  font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
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

      {/* Media Modal */}
      {modalOpen && (
        <PostModal
          post={post}
          initialIndex={modalIndex}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
