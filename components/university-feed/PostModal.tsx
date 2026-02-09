"use client";

import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, User } from "lucide-react";
import { ApprovedContent } from "@/types/database";
import CommentSection from "./CommentSection";
import { formatDistanceToNow } from "date-fns";

const isImage = (filename?: string | null) => {
  if (!filename) return false;
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(filename);
};

const isVideo = (filename?: string | null) => {
  if (!filename) return false;
  return /\.(mp4|mov|webm)$/i.test(filename);
};

interface Attachment {
  url: string;
  filename: string;
}

const parseAttachments = (
  url: string | null,
  filename: string | null,
): Attachment[] => {
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
    return [{ url, filename: filename || "Attachment" }];
  } catch (e) {
    return [{ url, filename: filename || "Attachment" }];
  }
};

interface PostModalProps {
  post: ApprovedContent;
  initialIndex: number;
  onClose: () => void;
}

export default function PostModal({
  post,
  initialIndex,
  onClose,
}: PostModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Parse attachments
  const allAttachments = parseAttachments(
    post.attachment_url,
    post.attachment_filename,
  );
  const mediaAttachments = allAttachments.filter(
    (a) => isImage(a.filename) || isVideo(a.filename),
  );

  const currentMedia = mediaAttachments[currentIndex];
  // Safety check
  if (!currentMedia) return null;

  const hasNext = currentIndex < mediaAttachments.length - 1;
  const hasPrev = currentIndex > 0;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasNext) setCurrentIndex(currentIndex + 1);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasPrev) setCurrentIndex(currentIndex - 1);
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && hasNext) setCurrentIndex((i) => i + 1);
      if (e.key === "ArrowLeft" && hasPrev) setCurrentIndex((i) => i - 1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasNext, hasPrev, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-10">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 left-4 md:top-6 md:left-6 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors z-[60]"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="flex flex-col md:flex-row w-full h-full max-w-7xl max-h-[90vh] bg-black rounded-xl overflow-hidden shadow-2xl">
        {/* Left: Media Viewer */}
        <div className="flex-1 relative bg-black flex items-center justify-center min-h-[40vh] md:h-full">
          {/* Navigation Arrows */}
          {hasPrev && (
            <button
              onClick={handlePrev}
              className="absolute left-4 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {hasNext && (
            <button
              onClick={handleNext}
              className="absolute right-4 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Media Content */}
          <div className="w-full h-full flex items-center justify-center p-2">
            {isVideo(currentMedia.filename) ? (
              <video
                src={currentMedia.url}
                controls
                autoPlay
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <img
                src={currentMedia.url}
                alt={currentMedia.filename}
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>
        </div>

        {/* Right: Sidebar (Info & Comments) */}
        <div className="w-full md:w-[400px] lg:w-[450px] bg-white dark:bg-gray-900 flex flex-col h-[50vh] md:h-full border-l border-gray-800">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500">
                <User className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {post.author_name || "Anonymous"}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(
                    new Date(post.approved_at || post.created_at),
                    { addSuffix: true },
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Captions + Comments Scroll Area */}
          <div className="flex-1 min-h-0 relative">
            <CommentSection contentId={post.id} post={post} />
          </div>
        </div>
      </div>
    </div>
  );
}
