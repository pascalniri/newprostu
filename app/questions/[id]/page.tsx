"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Navigation from "@/components/navigation";
import { useContent } from "@/hooks";
import axiosInstance from "@/lib/axios";
import { formatDistanceToNow, format } from "date-fns";
import {
  Loader2,
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  Bookmark,
  Share2,
  Edit3,
  Flag,
  Clock,
  Eye,
  Tag,
  MessageCircle,
  Award,
  CheckCircle2,
  Link2,
  Download,
  MoreHorizontal,
  ThumbsUp,
  ThumbsDown,
  Reply,
  AlertCircle,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AnswersSection from "@/components/answers-section";
import HomeSidebar from "@/components/home-sidebar";
import { useUniversities } from "@/hooks";
import { ApprovedContent } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AuthModal } from "@/components/auth-modal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import Link from "next/link";

export default function QuestionDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { content: allContent, getSingleContent } = useContent();
  const { universities, isLoading: universitiesLoading } = useUniversities();

  const [question, setQuestion] = useState<ApprovedContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [newAnswer, setNewAnswer] = useState("");
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);

  const relatedQuestions = useMemo(() => {
    if (!question || !allContent) return [];
    return allContent
      .filter((q) => q.id !== question.id && q.topic === question.topic)
      .slice(0, 5);
  }, [allContent, question]);

  const hotQuestions = useMemo(() => {
    if (!question || !allContent) return [];
    return allContent
      .filter((q) => q.id !== question.id)
      .sort((a, b) => (b.votes || 0) - (a.votes || 0))
      .slice(0, 5);
  }, [allContent, question]);

  const refreshContent = async () => {
    if (!params.id) return;
    const userId = localStorage.getItem("admin_user")
      ? JSON.parse(localStorage.getItem("admin_user") || "{}").id
      : null;
    const result = await getSingleContent(params.id as string, userId);
    if (result) {
      setQuestion(result);
    }
  };

  useEffect(() => {
    const fetchQuestionAndTrackView = async () => {
      if (params.id) {
        setIsLoading(true);
        const userId = localStorage.getItem("admin_user")
          ? JSON.parse(localStorage.getItem("admin_user") || "{}").id
          : null;

        const result = await getSingleContent(params.id as string, userId);
        if (result) {
          setQuestion(result);

          // Track view - only run once per session/visit to avoid spamming
          const hasViewedKey = `viewed_${params.id}`;
          if (!sessionStorage.getItem(hasViewedKey)) {
            try {
              await fetch("/api/views", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content_id: params.id }),
              });
              sessionStorage.setItem(hasViewedKey, "true");

              // Optimistically increment local state view count if it exists
              if (result.view_count !== undefined) {
                setQuestion({
                  ...result,
                  view_count: result.view_count + 1,
                } as any);
              }
            } catch (error) {
              console.error("Failed to increment view count", error);
            }
          }

          // Check bookmark status
          if (userId) {
            try {
              const res = await fetch(`/api/bookmarks?user_id=${userId}`);
              const data = await res.json();
              if (data.success && data.bookmarks) {
                const isSaved = data.bookmarks.some(
                  (b: any) => b.content_id === params.id,
                );
                setIsBookmarked(isSaved);
              }
            } catch (error) {
              console.error("Failed to fetch bookmarks", error);
            }
          }
        }
        setIsLoading(false);
      }
    };

    fetchQuestionAndTrackView();
  }, [params.id, getSingleContent]);

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;

    const userId = localStorage.getItem("admin_user")
      ? JSON.parse(localStorage.getItem("admin_user") || "{}").id
      : null;

    if (!userId) {
      setIsAuthModalOpen(true);
      return;
    }

    setIsSubmittingAnswer(true);
    try {
      const response = await axiosInstance.post("/comments", {
        content_id: params.id,
        content: newAnswer,
        author_name: "Student",
      });

      if (response.data.success) {
        setNewAnswer("");
        setShowAnswerForm(false);
        refreshContent();
      }
    } catch (error) {
      console.error("Failed to post answer", error);
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  const handleBookmarkToggle = async () => {
    const userId = localStorage.getItem("admin_user")
      ? JSON.parse(localStorage.getItem("admin_user") || "{}").id
      : null;

    if (!userId) {
      // Prompt user to login or handle unauthenticated state
      alert("Please log in to save posts.");
      return;
    }

    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content_id: question?.id, user_id: userId }),
      });
      const data = await res.json();
      if (data.success) {
        setIsBookmarked(data.is_bookmarked);
      }
    } catch (error) {
      console.error("Failed to toggle bookmark", error);
    }
  };

  const handleVote = async (type: 1 | -1) => {
    const userId = localStorage.getItem("admin_user")
      ? JSON.parse(localStorage.getItem("admin_user") || "{}").id
      : null;
    if (!userId || !question?.id) {
      setIsAuthModalOpen(true);
      return;
    }

    const previousVotes = (question as any).votes || 0;
    const previousUserVote = (question as any).userVote || null;

    setQuestion((prev: any) => {
      if (!prev) return prev;
      let newVoteCount = prev.votes || 0;

      if (previousUserVote === type) {
        newVoteCount -= type;
        return { ...prev, votes: newVoteCount, userVote: null };
      } else if (previousUserVote === -type) {
        newVoteCount += 2 * type;
        return { ...prev, votes: newVoteCount, userVote: type };
      } else {
        newVoteCount += type;
        return { ...prev, votes: newVoteCount, userVote: type };
      }
    });

    try {
      await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content_id: question.id,
          vote_type: type,
          user_id: userId,
        }),
      });
      refreshContent();
    } catch (error) {
      console.error("Failed to vote", error);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareTooltip(true);
    setTimeout(() => setShowShareTooltip(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F3ED] dark:bg-black">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading question...
          </p>
        </div>
      </div>
    );
  }

  if (!question && !isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F6F3ED] dark:bg-black p-4 space-y-6">
        <AlertCircle className="w-16 h-16 text-gray-400" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Question Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
          The question you're looking for doesn't exist or has been removed.
        </p>
        <Button
          onClick={() => router.push("/")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>
    );
  }

  const uni = universities.find((u) => u.name === question?.university);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[#F6F3ED] dark:bg-black pb-12 font-sans">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <Navigation />

          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-4 mb-2">
            <button
              onClick={() => router.push("/")}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Home
            </button>
            <span>/</span>
            <span className="text-gray-900 dark:text-white font-medium truncate max-w-md">
              {question?.title}
            </span>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Main Content */}
            <main className="flex-1 lg:flex-[3] xl:flex-[4] w-full min-w-0">
              {/* Question Header */}
              <div className="bg-white dark:bg-gray-900 border border-[#E5E7EB] dark:border-gray-800 rounded-lg overflow-hidden">
                <div className="p-6">
                  {/* Title and Actions */}
                  <div className="flex justify-between items-start gap-4">
                    <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                      {question?.title}
                    </h1>
                    <Button
                      onClick={() => router.push("/ask-share")}
                      className="bg-blue-600 hover:bg-blue-700 text-white shrink-0 shadow-sm"
                    >
                      Ask Question
                    </Button>
                  </div>

                  {/* Question Metadata */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-4 pb-4 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>
                        Asked{" "}
                        {question?.created_at
                          ? formatDistanceToNow(new Date(question.created_at), {
                              addSuffix: true,
                            })
                          : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Eye className="w-4 h-4" />
                      {/* Note: TS might complain about view_count if Submission interface isn't fully synced but we casted 'any' above or ignore if it is on ApprovedContent */}
                      <span>
                        Viewed {(question as any)?.view_count || 0} times
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MessageCircle className="w-4 h-4" />
                      <span>Modified today</span>
                    </div>
                  </div>

                  {/* Main Question Content */}
                  <div className="pt-6">
                    {/* Question Body */}
                    <div className="flex-1 min-w-0">
                      {/* Question Text */}
                      <div className="prose prose-gray dark:prose-invert max-w-none">
                        <p className="text-base text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                          {question?.details}
                        </p>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mt-6">
                        {question?.tags?.map((tag, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="bg-[#E1ECF4] text-[#39739D] dark:bg-blue-900/40 dark:text-blue-300 hover:bg-[#D0E3F1] dark:hover:bg-blue-800/60 cursor-pointer px-2 py-1 text-xs font-normal"
                          >
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                        {question?.post_type && (
                          <Badge
                            variant="outline"
                            className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                          >
                            {question.post_type}
                          </Badge>
                        )}
                      </div>

                      {/* Attachments */}
                      {question &&
                        (question.attachment_url ||
                          question.attachment_type) && (
                          <div className="mt-6 space-y-4">
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                              <Link2 className="w-4 h-4" />
                              Attachments
                            </h3>

                            {question.attachment_type === "link" ? (
                              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-3">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                      {question.attachment_filename ||
                                        "Link Attachment"}
                                    </p>
                                    {question.attachment_url && (
                                      <a
                                        href={question.attachment_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-blue-600 hover:underline truncate block"
                                      >
                                        {question.attachment_url}
                                      </a>
                                    )}
                                  </div>
                                  <Button variant="outline" size="sm" asChild>
                                    <Link
                                      href={question.attachment_url || "#"}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      Visit Link
                                    </Link>
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              (() => {
                                const isImage = (filename?: string | null) => {
                                  if (!filename) return false;
                                  return /\.(jpg|jpeg|png|gif|webp)$/i.test(
                                    filename,
                                  );
                                };

                                const parseAttachmentsData = (
                                  url: string | null,
                                  filename: string | null,
                                ) => {
                                  if (!url) return [];
                                  try {
                                    const parsedUrls = JSON.parse(url);
                                    const parsedFilenames = filename
                                      ? JSON.parse(filename)
                                      : [];
                                    if (Array.isArray(parsedUrls)) {
                                      return parsedUrls.map((u, i) => ({
                                        url: u,
                                        filename:
                                          parsedFilenames[i] || "Attachment",
                                      }));
                                    }
                                    return [
                                      {
                                        url,
                                        filename: filename || "Attachment",
                                      },
                                    ];
                                  } catch (e) {
                                    return [
                                      {
                                        url,
                                        filename: filename || "Attachment",
                                      },
                                    ];
                                  }
                                };

                                const attachments = parseAttachmentsData(
                                  question.attachment_url,
                                  question.attachment_filename,
                                );

                                const mediaAttachments = attachments.filter(
                                  (a) => isImage(a.filename),
                                );
                                const fileAttachments = attachments.filter(
                                  (a) => !isImage(a.filename),
                                );

                                return (
                                  <>
                                    {mediaAttachments.length > 0 && (
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {mediaAttachments.map((file, index) => (
                                          <div
                                            key={`media-${index}`}
                                            className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800"
                                          >
                                            <img
                                              src={file.url}
                                              alt={file.filename}
                                              className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                              onClick={() =>
                                                window.open(file.url, "_blank")
                                              }
                                            />
                                            <div className="p-2 bg-white dark:bg-gray-900">
                                              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                                {file.filename}
                                              </p>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}

                                    {fileAttachments.length > 0 && (
                                      <div className="space-y-2">
                                        {fileAttachments.map((file, index) => (
                                          <div
                                            key={`file-${index}`}
                                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
                                          >
                                            <div className="flex items-center gap-3 min-w-0">
                                              <Download className="w-4 h-4 text-gray-400" />
                                              <span className="text-sm text-gray-900 dark:text-white truncate">
                                                {file.filename}
                                              </span>
                                            </div>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              asChild
                                            >
                                              <a href={file.url} download>
                                                Download
                                              </a>
                                            </Button>
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

                      {/* Action Buttons */}
                      <div className="flex items-center gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
                        <div className="flex items-center bg-gray-50 dark:bg-gray-800/50 rounded-md border border-gray-200 dark:border-gray-700">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVote(1)}
                            className={`px-3 py-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 ${(question as any).userVote === 1 ? "text-blue-600 bg-blue-50 dark:bg-blue-900/40 dark:text-blue-400" : ""}`}
                          >
                            <ThumbsUp
                              className={`w-4 h-4 mr-1.5 ${(question as any).userVote === 1 ? "fill-current" : ""}`}
                            />
                            <span className="font-medium mr-1">
                              {(question as any).votes || 0}
                            </span>
                          </Button>
                          <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`px-3 py-1 text-gray-600 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 ${(question as any).userVote === -1 ? "text-red-500 bg-red-50 dark:bg-red-900/40 dark:text-red-400" : ""}`}
                            onClick={() => handleVote(-1)}
                          >
                            <ThumbsDown
                              className={`w-4 h-4 ${(question as any).userVote === -1 ? "fill-current" : ""}`}
                            />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`text-gray-600 dark:text-gray-400 ${showAnswerForm ? "bg-gray-100 dark:bg-gray-800" : ""}`}
                          onClick={() => {
                            const userId = localStorage.getItem("admin_user");
                            if (!userId) {
                              setIsAuthModalOpen(true);
                              return;
                            }
                            setShowAnswerForm(!showAnswerForm);
                          }}
                        >
                          <Reply className="w-4 h-4 mr-2" />
                          Reply
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-600 dark:text-gray-400"
                          onClick={handleBookmarkToggle}
                        >
                          <Bookmark
                            className={`w-4 h-4 mr-2 ${isBookmarked ? "text-yellow-500 fill-current" : ""}`}
                          />
                          {isBookmarked ? "Saved" : "Save"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-600 dark:text-gray-400"
                          onClick={handleShare}
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                      </div>

                      {/* Author Info Card */}
                      <div className="mt-6 p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/30">
                        <div className="flex items-start gap-4">
                          <Avatar className="w-12 h-12 border-2 border-white dark:border-gray-800">
                            <AvatarImage src={uni?.logo_url || undefined} />
                            <AvatarFallback className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 text-lg">
                              {question?.author_name?.charAt(0).toUpperCase() ||
                                "A"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-blue-600 dark:text-blue-400">
                                {question?.author_name || "Anonymous User"}
                              </span>
                              {question?.grade_level && (
                                <Badge
                                  variant="outline"
                                  className="text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800"
                                >
                                  {question.grade_level}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {question?.university ||
                                "University not specified"}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                              Asked:{" "}
                              {question?.created_at
                                ? format(
                                    new Date(question.created_at),
                                    "MMM d, yyyy 'at' h:mm a",
                                  )
                                : ""}
                            </p>
                          </div>
                        </div>
                      </div>

                      {showAnswerForm && (
                        <div className="mt-6 animate-in slide-in-from-top-4 fade-in duration-200 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden transition-shadow focus-within:shadow-md focus-within:border-blue-300 dark:focus-within:border-blue-700">
                          <div className="p-3.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
                            <h3 className="text-[15px] font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                              Write an Answer
                            </h3>
                          </div>
                          <form
                            onSubmit={handleAnswerSubmit}
                            className="flex flex-col"
                          >
                            <textarea
                              value={newAnswer}
                              onChange={(e) => setNewAnswer(e.target.value)}
                              className="w-full min-h-[140px] p-4 text-[15px] bg-transparent resize-y outline-none font-sans text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                              placeholder="Share your expertise with the community..."
                              required
                              autoFocus
                            />
                            <div className="flex items-center justify-between p-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/10 m-1 rounded-b-lg">
                              <div className="text-[12px] text-gray-500 flex items-center gap-1.5">
                                <Info className="w-3.5 h-3.5 text-blue-500" />
                                Be respectful and provide clear details.
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  className="h-auto px-4 py-1.5 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 text-sm font-medium rounded-full"
                                  onClick={() => setShowAnswerForm(false)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  type="submit"
                                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm px-5 py-1.5 h-auto rounded-[5px] text-sm font-medium"
                                  disabled={
                                    isSubmittingAnswer || !newAnswer.trim()
                                  }
                                >
                                  {isSubmittingAnswer ? (
                                    <>
                                      <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                                      Posting...
                                    </>
                                  ) : (
                                    "Post Answer"
                                  )}
                                </Button>
                              </div>
                            </div>
                          </form>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Answers Section */}
                {question && (
                  <AnswersSection
                    questionId={question.id}
                    initialAnswers={(question as any).comments || []}
                    onUpdate={refreshContent}
                  />
                )}
              </div>
            </main>

            {/* Right Sidebar */}
            <aside className="hidden lg:block w-[320px] xl:w-[350px] shrink-0 space-y-6">
              {/* Related Questions */}
              <div className="bg-white dark:bg-gray-900 border border-[#E5E7EB] dark:border-gray-800 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Related Questions
                  </h3>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    {relatedQuestions.length > 0 ? (
                      relatedQuestions.map((q) => (
                        <div key={q.id} className="group cursor-pointer">
                          <div className="flex items-start gap-2">
                            <div className="flex flex-col items-center min-w-[40px] text-xs">
                              <span className="font-medium text-gray-700 dark:text-gray-300">
                                {q.votes || 0}
                              </span>
                              <span className="text-gray-500">votes</span>
                            </div>
                            <div className="flex-1">
                              <Link
                                href={`/questions/${q.id}`}
                                className="text-sm text-blue-600 dark:text-blue-400 group-hover:underline block"
                              >
                                {q.title}
                              </Link>
                              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                <span>{q.answers_count || 0} answers</span>
                                <span>{q.view_count || 0} views</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-4">
                        No related questions found.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Hot Network Questions */}
              <div className="bg-white dark:bg-gray-900 border border-[#E5E7EB] dark:border-gray-800 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-orange-500" />
                    Hot Network Questions
                  </h3>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    {hotQuestions.length > 0 ? (
                      hotQuestions.map((q) => (
                        <Link
                          href={`/questions/${q.id}`}
                          key={q.id}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer block"
                        >
                          • {q.title}
                        </Link>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-4">
                        No hot questions available.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <HomeSidebar
                universities={universities}
                isLoading={universitiesLoading}
              />
            </aside>
          </div>

          {/* Share Tooltip */}
          {showShareTooltip && (
            <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-in slide-in-from-bottom">
              Link copied to clipboard!
            </div>
          )}
        </div>
      </div>

      <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />
    </TooltipProvider>
  );
}
