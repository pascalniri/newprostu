import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import { AuthModal } from "@/components/auth-modal";
import { formatDistanceToNow } from "date-fns";
import {
  Loader2,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  MessageCircle,
  Info,
  Reply,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnswerSectionProps {
  questionId: string;
  initialAnswers: Answer[];
  onUpdate: () => void;
}

interface Answer {
  id: string;
  content: string;
  author_name: string;
  author_school?: string;
  created_at: string;
  votes: number;
  is_accepted?: boolean;
  userVote?: 1 | -1 | null;
  parent_id?: string | null;
}

export default function AnswersSection({
  questionId,
  initialAnswers,
  onUpdate,
}: AnswerSectionProps) {
  const [answers, setAnswers] = useState<Answer[]>(initialAnswers || []);
  const [newAnswer, setNewAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  useEffect(() => {
    if (!initialAnswers) return;
    const sortedAnswers = [...initialAnswers].sort((a: any, b: any) => {
      if (a.is_accepted) return -1;
      if (b.is_accepted) return 1;
      return (b.votes || 0) - (a.votes || 0);
    });
    setAnswers(sortedAnswers);
  }, [initialAnswers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post("/comments", {
        content_id: questionId,
        content: newAnswer,
        author_name: "Student",
      });

      if (response.data.success) {
        setNewAnswer("");
        onUpdate();
      }
    } catch (error) {
      console.error("Failed to post answer", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplySubmit = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setIsSubmittingReply(true);
    try {
      const response = await axiosInstance.post("/comments", {
        content_id: questionId,
        content: replyContent,
        author_name: "Student",
        parent_id: parentId,
      });

      if (response.data.success) {
        setReplyContent("");
        setReplyingTo(null);
        onUpdate();
      }
    } catch (error) {
      console.error("Failed to post reply", error);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleVote = async (answerId: string, type: 1 | -1) => {
    const userId = localStorage.getItem("admin_user")
      ? JSON.parse(localStorage.getItem("admin_user") || "{}").id
      : null;
    if (!userId) {
      setIsAuthModalOpen(true);
      return;
    }

    setAnswers((prevAnswers) =>
      prevAnswers.map((answer) => {
        if (answer.id === answerId) {
          const previousVote = answer.userVote || 0;
          let newVoteCount = answer.votes;

          if (previousVote === type) {
            newVoteCount -= type;
            return { ...answer, votes: newVoteCount, userVote: null };
          } else if (previousVote === -type) {
            newVoteCount += 2 * type;
            return { ...answer, votes: newVoteCount, userVote: type };
          } else {
            newVoteCount += type;
            return { ...answer, votes: newVoteCount, userVote: type };
          }
        }
        return answer;
      }),
    );

    try {
      const response = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comment_id: answerId,
          vote_type: type,
          user_id: userId,
        }),
      });

      const data = await response.json();
      if (!data.success) {
        onUpdate();
      }
    } catch (error) {
      console.error("Failed to vote for answer", error);
      onUpdate();
    }
  };

  const handleAccept = async (answerId: string) => {
    const userId = localStorage.getItem("admin_user")
      ? JSON.parse(localStorage.getItem("admin_user") || "{}").id
      : null;
    if (!userId) {
      setIsAuthModalOpen(true);
      return;
    }

    try {
      const response = await fetch(`/api/comments/${answerId}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, content_id: questionId }),
      });
      const data = await response.json();

      if (data.success) {
        onUpdate();
      } else {
        alert(data.message || "Failed to mark as accepted");
      }
    } catch (error) {
      console.error("Failed to mark answer as accepted", error);
    }
  };

  const topLevelAnswers = answers.filter((a) => !a.parent_id);
  const getReplies = (parentId: string) =>
    answers
      .filter((a) => a.parent_id === parentId)
      .sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      );

  return (
    <div className="w-full flex flex-col gap-6 mt-8 p-5">
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-blue-500" />
          {topLevelAnswers.length}{" "}
          {topLevelAnswers.length === 1 ? "Answer" : "Answers"}
        </h2>
      </div>

      {topLevelAnswers.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-center bg-gray-50/50 dark:bg-gray-800/20 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
          <MessageCircle className="w-8 h-8 text-gray-300 dark:text-gray-600 mb-3" />
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            No answers yet
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
            Be the first to share your knowledge and help out a fellow student!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {topLevelAnswers.map((answer) => (
            <div key={answer.id} className="flex flex-col gap-2">
              <div
                className={`flex gap-3 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg transition-all relative ${
                  answer.is_accepted
                    ? "border-green-200 dark:border-green-900/50 shadow-green-100/20 dark:shadow-none bg-green-50/10"
                    : "border-gray-100 dark:border-gray-800/80 hover:border-gray-300 dark:hover:border-gray-700"
                }`}
              >
                {answer.is_accepted && (
                  <div className="absolute inset-0 bg-green-50/30 dark:bg-green-500/5 rounded-lg pointer-events-none" />
                )}

                <div className="shrink-0 mt-0.5 relative z-10">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold text-xs border border-blue-200/50 dark:border-blue-800/50">
                    {(answer.author_name
                      ? answer.author_name.charAt(0)
                      : "A"
                    ).toUpperCase()}
                  </div>
                </div>

                <div className="flex-1 min-w-0 flex flex-col relative z-10">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 flex-wrap text-sm">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {answer.author_name || "Anonymous"}
                      </span>
                      {answer.is_accepted && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                      )}
                      {(answer.author_school || answer.created_at) && (
                        <span className="text-gray-300 dark:text-gray-600 px-0.5">
                          •
                        </span>
                      )}
                      {answer.author_school && (
                        <span className="text-gray-600 dark:text-gray-400">
                          {answer.author_school}
                        </span>
                      )}
                      {answer.author_school && answer.created_at && (
                        <span className="text-gray-300 dark:text-gray-600 px-0.5">
                          •
                        </span>
                      )}
                      <span className="text-gray-500 dark:text-gray-500 text-xs text-nowrap">
                        {answer.created_at
                          ? formatDistanceToNow(new Date(answer.created_at), {
                              addSuffix: true,
                            })
                          : ""}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap mb-3">
                    {answer.content}
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center gap-3 mt-auto flex-wrap">
                    {/* Votes */}
                    <div className="flex items-center bg-gray-50 dark:bg-gray-800/50 rounded-full border border-gray-200/60 dark:border-gray-700/50 h-7 overflow-hidden">
                      <button
                        onClick={() => handleVote(answer.id, 1)}
                        className={`h-full px-2 flex items-center justify-center transition-all hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          answer.userVote === 1
                            ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30"
                            : "text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
                        }`}
                        title="Upvote"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <span
                        className={`text-[11px] font-semibold px-2 min-w-[20px] text-center ${
                          answer.userVote === 1
                            ? "text-blue-600"
                            : answer.userVote === -1
                              ? "text-red-600"
                              : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {answer.votes || 0}
                      </span>
                      <button
                        onClick={() => handleVote(answer.id, -1)}
                        className={`h-full px-2 flex items-center justify-center transition-all hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          answer.userVote === -1
                            ? "text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/30"
                            : "text-gray-500 hover:text-red-500 dark:hover:text-red-400"
                        }`}
                        title="Downvote"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        const userId = localStorage.getItem("admin_user");
                        if (!userId) {
                          setIsAuthModalOpen(true);
                          return;
                        }
                        if (replyingTo === answer.id) {
                          setReplyingTo(null);
                        } else {
                          setReplyingTo(answer.id);
                          setReplyContent("");
                        }
                      }}
                      className="flex items-center gap-1.5 text-[11px] text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 transition-colors font-medium"
                    >
                      <Reply className="w-3.5 h-3.5" />
                      Reply
                    </button>

                    {!answer.is_accepted && (
                      <button
                        onClick={() => handleAccept(answer.id)}
                        className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 transition-colors ml-auto"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        Accept
                      </button>
                    )}
                    {answer.is_accepted && (
                      <div className="flex items-center gap-1 text-[11px] font-medium text-green-700 dark:text-green-400 ml-auto bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full border border-green-200 dark:border-green-800">
                        <CheckCircle2 className="w-3 h-3 fill-green-100 dark:fill-green-900/30" />
                        Accepted
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Reply Form */}
              {replyingTo === answer.id && (
                <div className="ml-5 md:ml-11 flex gap-3 mt-1 align-center">
                  <div className="flex-1 flex flex-col gap-2 p-3 bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <form
                      onSubmit={(e) => handleReplySubmit(e, answer.id)}
                      className="flex flex-col gap-2"
                    >
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        className="w-full min-h-[70px] p-2.5 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md outline-none focus:border-blue-400 focus:bg-white dark:focus:bg-gray-900 transition-colors placeholder:text-gray-400 font-sans"
                        placeholder={`Reply to ${answer.author_name}...`}
                        autoFocus
                      />
                      <div className="flex justify-end gap-2 mt-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setReplyingTo(null)}
                          className="h-7 text-xs px-3 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          size="sm"
                          className="h-7 text-xs px-4 bg-blue-600 hover:bg-blue-700 text-white"
                          disabled={isSubmittingReply || !replyContent.trim()}
                        >
                          {isSubmittingReply ? (
                            <Loader2 className="w-3 h-3 animate-spin mr-1" />
                          ) : null}
                          {isSubmittingReply ? "Posting..." : "Post Reply"}
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Nested Replies */}
              {getReplies(answer.id).length > 0 && (
                <div className="ml-5 md:ml-12 mt-2 flex flex-col gap-3 border-l-2 border-gray-100 dark:border-gray-800/60 pl-4 py-1">
                  {getReplies(answer.id).map((reply) => (
                    <div key={reply.id} className="flex gap-3 group relative">
                      <div className="shrink-0 mt-0.5 relative z-10">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 font-bold text-[10px] border border-gray-300 dark:border-gray-600">
                          {(reply.author_name
                            ? reply.author_name.charAt(0)
                            : "A"
                          ).toUpperCase()}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col">
                        <div className="flex items-center gap-1.5 flex-wrap text-sm mb-0.5">
                          <span className="font-medium text-gray-900 dark:text-gray-100 text-[13px]">
                            {reply.author_name || "Anonymous"}
                          </span>
                          <span className="text-gray-500 dark:text-gray-500 text-[11px] text-nowrap">
                            {reply.created_at
                              ? formatDistanceToNow(
                                  new Date(reply.created_at),
                                  { addSuffix: true },
                                )
                              : ""}
                          </span>
                        </div>
                        <div className="text-gray-700 dark:text-gray-300 text-[13.5px] leading-relaxed whitespace-pre-wrap">
                          {reply.content}
                        </div>

                        {/* Thread Voting */}
                        <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleVote(reply.id, 1)}
                            className={`p-1 rounded transition-colors ${
                              reply.userVote === 1
                                ? "text-blue-600"
                                : "text-gray-400 hover:text-blue-600"
                            }`}
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <span
                            className={`text-[11px] font-semibold min-w-[12px] text-center ${
                              reply.userVote === 1
                                ? "text-blue-600"
                                : reply.userVote === -1
                                  ? "text-red-600"
                                  : "text-gray-500"
                            }`}
                          >
                            {reply.votes || 0}
                          </span>
                          <button
                            onClick={() => handleVote(reply.id, -1)}
                            className={`p-1 rounded transition-colors ${
                              reply.userVote === -1
                                ? "text-red-500"
                                : "text-gray-400 hover:text-red-500"
                            }`}
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Your Answer Box */}
      

      <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />
    </div>
  );
}
