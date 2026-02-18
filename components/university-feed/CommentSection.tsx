"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import {
  Loader2,
  Send,
  FileText,
  X,
  Smile,
  Paperclip,
  Heart,
} from "lucide-react";
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
  parent_id?: string | null;
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
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

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

  const handleSubmit = async (
    e: React.FormEvent,
    parentId: string | null = null,
  ) => {
    e.preventDefault();
    if (!newComment.trim() && !attachment) return;

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post("/comments", {
        content_id: contentId,
        content: newComment,
        attachment_url: attachment?.url,
        attachment_name: attachment?.name,
        attachment_type: attachment?.type,
        parent_id: parentId,
        // TODO: Add author_id if auth is available
        author_name: "Student", // Placeholder
      });

      if (response.data.success) {
        setNewComment("");
        setAttachment(null);
        setReplyingTo(null);
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

  const renderComment = (comment: Comment) => {
    const replies = comments.filter((c) => c.parent_id === comment.id);
    const isReplying = replyingTo === comment.id;

    return (
      <div key={comment.id} className="flex flex-col gap-2 group">
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400 shrink-0 mt-1">
            {comment.author_name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {comment.author_name}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatDistanceToNow(new Date(comment.created_at), {
                  addSuffix: true,
                })}
              </span>
            </div>

            <p className="text-sm text-gray-800 dark:text-gray-200 mt-1 whitespace-pre-wrap leading-relaxed">
              {comment.content}
            </p>

            {comment.attachment_url && (
              <div className="mt-2 flex items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                  <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                    <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate max-w-[200px]">
                    {comment.attachment_name || "Attachment"}
                  </span>
                </div>
                <a
                  href={comment.attachment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-3 py-2 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors shadow-sm"
                >
                  View
                </a>
              </div>
            )}

            {/* Interaction Actions */}
            <div className="flex items-center gap-4 mt-2">
              <button
                onClick={() => setReplyingTo(isReplying ? null : comment.id)}
                className="text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Reply
              </button>
            </div>
          </div>
        </div>

        {/* Inline Reply Box */}
        {isReplying && (
          <div className="ml-11 mt-2">
            <form
              onSubmit={(e) => handleSubmit(e, comment.id)}
              className="flex items-end gap-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-[20px] p-2 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all"
            >
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={`Reply to ${comment.author_name}...`}
                className="w-full min-h-[36px] max-h-[100px] py-2 px-3 bg-transparent border-none focus:ring-0 outline-none resize-none placeholder:text-gray-500 dark:placeholder:text-gray-400 text-sm"
                required
                autoFocus
                rows={1}
                style={{ minHeight: "36px" }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (newComment.trim()) handleSubmit(e, comment.id);
                  }
                }}
              />
              <Button
                type="submit"
                disabled={isSubmitting || !newComment.trim()}
                size="sm"
                className="rounded-full h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shrink-0"
              >
                {isSubmitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send size={14} className="ml-0.5" />
                )}
              </Button>
            </form>
          </div>
        )}

        {/* Nested Replies */}
        {replies.length > 0 && (
          <div className="ml-8 border-l-2 border-gray-100 dark:border-gray-800 pl-4 mt-2 space-y-4">
            {replies.map(renderComment)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Scrollable Content: Caption + Comments */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {/* Caption (conditional) */}
        {post && (
          <div className="p-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700 shrink-0">
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                  {post.author_name ? post.author_name.charAt(0) : "A"}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {post.author_name || "Author"}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDistanceToNow(new Date(post.created_at), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-800 dark:text-gray-200 mt-1 whitespace-pre-wrap">
                  {post.details}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 space-y-6">
          <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">
            Comments ({comments.length})
          </h4>

          {/* List */}
          <div className="space-y-6">
            {isLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No comments yet. Start the conversation!
                </p>
              </div>
            ) : (
              comments.filter((c) => !c.parent_id).map(renderComment)
            )}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Input Area (Hidden when replying inline? Maybe keep it as 'New Comment' box) */}
      <div className="shrink-0 p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <form
          onSubmit={(e) => handleSubmit(e, null)}
          className="flex items-end gap-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-2 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all"
        >
          <div className="flex-1 min-w-0">
            {/* Attachment Preview (Inside Input Area) */}
            {attachment && (
              <div className="flex items-center gap-2 p-1.5 mx-2 mt-1 mb-1 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-100 dark:border-blue-800 w-fit">
                <FileText size={12} className="text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="text-xs font-medium text-blue-700 dark:text-blue-300 truncate max-w-[150px]">
                  {attachment.name}
                </span>
                <button
                  type="button"
                  onClick={() => setAttachment(null)}
                  className="ml-1 p-0.5 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-full text-blue-500 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            )}

            <textarea
              value={!replyingTo ? newComment : ""} // Clear main input if replying
              onChange={(e) => !replyingTo && setNewComment(e.target.value)}
              onClick={() => setReplyingTo(null)} // Click main input cancels reply mode
              placeholder="Add a comment..."
              className="w-full max-h-[120px] py-2.5 px-4 bg-transparent border-none focus:ring-0 outline-none resize-none placeholder:text-gray-500 dark:placeholder:text-gray-400 text-sm"
              required={!attachment && !replyingTo}
              rows={1}
              style={{ minHeight: "44px" }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if ((newComment.trim() || attachment) && !replyingTo)
                    handleSubmit(e, null);
                }
              }}
            />
          </div>

          <div className="flex items-center gap-1 pb-1.5 pr-1.5">
            {/* Emoji Trigger */}
            <div className="relative emoji-picker-container">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="w-9 h-9 flex items-center justify-center p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full cursor-pointer transition-colors"
              >
                <Smile size={14} />
              </button>
              {showEmojiPicker && (
                <div className="absolute bottom-12 right-0 z-50 shadow-xl rounded-2xl overflow-hidden">
                  <EmojiPicker
                    onSelect={handleEmojiSelect}
                    onClose={() => setShowEmojiPicker(false)}
                  />
                </div>
              )}
            </div>

            {/* File Upload Trigger */}
            <FileUploader onFileSelect={setAttachment} showPreview={false}>
              <button
                type="button"
                className="w-9 h-9 flex items-center justify-center p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full cursor-pointer transition-colors"
              >
                <Paperclip size={14} />
              </button>
            </FileUploader>

            <button
              type="submit"
              disabled={
                isSubmitting ||
                (!newComment.trim() && !attachment && !replyingTo)
              }
              className="ml-1 rounded-full min-h-9 min-w-9 p-0 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-sm"
            >
              {isSubmitting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Send size={14} />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
