"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import { Loader2, Send, FileText, X, Smile, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import FileUploader from "./FileUploader";
import EmojiPicker from "./EmojiPicker";
import { formatDistanceToNow } from "date-fns";

import { ApprovedContent } from "@/types/database";

interface CommentSectionProps {
  contentId: string;
  post?: ApprovedContent;
}

interface Comment {
  id: string;
  content: string;
  author_name: string;
  created_at: string;
  attachment_url?: string;
  attachment_name?: string;
  attachment_type?: string;
}

export default function CommentSection({
  contentId,
  post,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachment, setAttachment] = useState<{
    url: string;
    name: string;
    type: string;
  } | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".emoji-picker-container")) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axiosInstance.get(
        `/comments?content_id=${contentId}`,
      );
      if (response.data.success) {
        setComments(response.data.comments);
      }
    } catch (error) {
      console.error("Failed to fetch comments", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [contentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post("/comments", {
        content_id: contentId,
        content: newComment,
        attachment_url: attachment?.url,
        attachment_name: attachment?.name,
        attachment_type: attachment?.type,
        // TODO: Add author_id if auth is available
        author_name: "Student", // Placeholder
      });

      if (response.data.success) {
        setNewComment("");
        setAttachment(null);
        // Optimistic update or refetch
        if (response.data.comment) {
          setComments([...comments, response.data.comment]);
        } else {
          fetchComments();
        }
      }
    } catch (error) {
      console.error("Failed to post comment", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewComment((prev) => prev + emoji);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Scrollable Content: Caption + Comments */}
      <div className="flex-1 overflow-y-auto px-4 min-h-0">
        {/* Caption (conditional) */}
        {post && (
          <div className="py-4 border-b border-gray-100 dark:border-gray-800">
            <h3 className="font-semibold mb-1 text-gray-900 dark:text-white">
              {post.title}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {post.details}
            </p>
          </div>
        )}

        <div className="py-4 space-y-6">
          <h4 className="font-semibold text-gray-900 dark:text-white">
            Comments ({comments.length})
          </h4>

          {/* List */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
              </div>
            ) : comments.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 italic">
                No comments yet. Be the first to share your thoughts!
              </p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300 shrink-0">
                    {comment.author_name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-gray-900 dark:text-white">
                          {comment.author_name}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDistanceToNow(new Date(comment.created_at), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {comment.content}
                      </p>

                      {comment.attachment_url && (
                        <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                          <a
                            href={comment.attachment_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 group hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded">
                              <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate max-w-[200px]">
                              {comment.attachment_name || "Attachment"}
                            </span>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Input Area */}
      <div className="shrink-0 p-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <form
          onSubmit={handleSubmit}
          className="relative bg-gray-50 dark:bg-gray-800/50 border border-transparent focus-within:border-gray-300 dark:focus-within:border-gray-600 rounded-2xl p-1 transition-all"
        >
          {/* Attachment Preview (Inside Input Area) */}
          {attachment && (
            <div className="flex items-center gap-2 p-2 mx-2 mt-2 mb-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800 w-fit max-w-full">
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="text-xs font-medium text-blue-700 dark:text-blue-300 truncate max-w-[200px]">
                {attachment.name}
              </span>
              <button
                type="button"
                onClick={() => setAttachment(null)}
                className="ml-1 p-0.5 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-full text-blue-500 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full min-h-[40px] max-h-[120px] p-3 bg-transparent border-none focus:ring-0 outline-none resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
            required
            rows={1}
            style={{ minHeight: "44px" }}
          />

          {/* Toolbar */}
          <div className="flex items-center justify-between px-2 pb-1">
            <div className="flex items-center gap-2">
              {/* Emoji Trigger */}
              <div className="relative emoji-picker-container">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                  title="Add emoji"
                >
                  <Smile size={18} />
                </button>
                {showEmojiPicker && (
                  <div className="absolute bottom-10 left-0 z-50">
                    <EmojiPicker
                      onSelect={handleEmojiSelect}
                      onClose={() => setShowEmojiPicker(false)}
                    />
                  </div>
                )}
              </div>

              {/* File Upload Trigger */}
              <FileUploader onFileSelect={setAttachment}>
                <button
                  type="button"
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                  title="Attach file"
                >
                  <Paperclip size={18} />
                </button>
              </FileUploader>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || (!newComment.trim() && !attachment)}
              size="sm"
              className="rounded px-4 h-8 bg-gray-800 hover:bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold">Post</span>
                  <Send size={12} />
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
