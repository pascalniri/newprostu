"use client";

import { useState } from "react";
import {
  Calendar,
  FileText,
  Heart,
  Link as LinkIcon,
  MessageSquare,
  Share2,
  Bookmark,
  User,
  MessageSquareMore,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { ApprovedContent } from "@/types/database";
import CommentSection from "./CommentSection";
import PostModal from "./PostModal";
import { Button } from "../ui/button";

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
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 last:border-b-0 overflow-hidden">
      {/* Header: User Info */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#F6F3ED] dark:bg-gray-700 flex items-center justify-center border border-gray-200 dark:border-gray-600">
            <User size={16} className="text-gray-500 dark:text-gray-400" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white leading-tight">
              {post.author_name || "Anonymous User"}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              <span>
                {post.author_school
                  ? `${post.author_school}`
                  : "Unknown School"}
              </span>
              <span>•</span>
              <span>
                {formatDistanceToNow(
                  new Date(post.approved_at || post.created_at),
                  { addSuffix: true },
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="px-4 pb-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          {post.title}
        </h2>
        <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed mb-3">
          {post.details.slice(0, 200)}
          {post.details.length > 200 && (
            <Button
              variant="link"
              size="sm"
              onClick={() => setModalOpen(true)}
              className="text-blue-600 dark:text-blue-400 p-0 h-auto ml-2"
            >
              Read More
            </Button>
          )}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-blue-600 dark:text-blue-400 text-xs font-medium bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded">
            #{post.topic}
          </span>
        </div>
      </div>

      {/* Attachments */}
      {(post.attachment_url || post.attachment_type) && (
        <div className="mt-2">
          {post.attachment_type === "link" ? (
            // Link Preview
            <div className="px-4 pb-4">
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
            </div>
          ) : (
            // Handle Multiple Attachments
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
                  {/* Media Layout - Edge to Edge */}
                  {mediaAttachments.length > 0 && (
                    <div
                      className={`w-full overflow-hidden bg-gray-100 dark:bg-gray-900 ${
                        mediaAttachments.length === 1 ? "" : "flex h-[350px]"
                      }`}
                    >
                      {mediaAttachments.map((file, index) => {
                        return (
                          <div
                            key={`media-${index}`}
                            className={`relative bg-black ${
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
                                className="w-full h-full cursor-pointer flex items-center justify-center bg-black"
                              >
                                <video
                                  src={file.url}
                                  className={`w-full h-full object-contain ${
                                    mediaAttachments.length === 1
                                      ? "max-h-[500px]"
                                      : ""
                                  }`}
                                />
                                {/* Play Icon Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/20 transition-colors">
                                  <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                                    <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1" />
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="w-full h-full bg-black flex items-center justify-center">
                                <img
                                  src={file.url}
                                  alt={file.filename}
                                  onClick={() => {
                                    setModalIndex(index);
                                    setModalOpen(true);
                                  }}
                                  className={`w-full h-full object-cover cursor-pointer ${
                                    mediaAttachments.length === 1
                                      ? "max-h-[500px] object-contain"
                                      : ""
                                  }`}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* File Attachments List */}
                  {fileAttachments.length > 0 && (
                    <div className="px-4 pt-2 pb-4 space-y-2">
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

      {/* Action Footer */}
      <div className="p-2 border border-gray-200 rounded-md dark:border-gray-700/50 m-3 flex items-center justify-between border-t border-gray-100 dark:border-gray-700/50">
        <div className="flex items-center gap-5">
          <button
            onClick={() => setShowComments(!showComments)}
            className={`flex flex-col items-center justify-center w-[100px] transition-colors p-2 cursor-pointer hover:bg-[#F6F3ED] rounded  ${showComments ? "text-gray-900 bg-[#F6F3ED]" : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"}`}
          >
            <MessageSquareMore size={14} className="" />
            <p className="text-[10px] font-semibold">Comment</p>
          </button>

          <button
            className={`flex flex-col items-center justify-center w-[100px] transition-colors p-2 hover:bg-[#F6F3ED] cursor-pointer rounded  text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"}`}
          >
            <Share2 size={14} className="" />
            <p className="text-[10px] font-semibold">Share {post.post_type}</p>
          </button>
        </div>

        {/* Post Type Badge */}
        <span
          className={`px-2.5 py-0.5 rounded text-[10px] font-medium ${
            post.post_type === "Question"
              ? "bg-orange-500 text-white dark:bg-blue-900/30 dark:text-blue-300"
              : "bg-green-500 text-white dark:bg-green-900/30 dark:text-green-300"
          }`}
        >
          {post.post_type}
        </span>
      </div>

      {/* Dynamic Comment Section */}
      {showComments && (
        <div className="bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 p-4">
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
