"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import { Loader2, Send, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import FileUploader from "./FileUploader";
import { formatDistanceToNow } from "date-fns";

interface CommentSectionProps {
  contentId: string;
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

export default function CommentSection({ contentId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachment, setAttachment] = useState<{
    url: string;
    name: string;
    type: string;
  } | null>(null);

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

  return (
    <div className="space-y-6">
      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
        Comments ({comments.length})
      </h4>

      {/* List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          </div>
        ) : comments.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
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
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
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

      {/* Input */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full min-h-[80px] p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-y"
          required
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="w-full sm:w-auto">
            <FileUploader onFileSelect={setAttachment} />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !newComment.trim()}
            size="sm"
            className="w-full sm:w-auto gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Post Comment
          </Button>
        </div>
      </form>
    </div>
  );
}
