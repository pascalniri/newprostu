"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type University = "Harvard" | "Stanford" | "UMich";

interface QuestionResource {
  id: number;
  title: string;
  type: "Question" | "Resource";
  topic: string;
  school: string;
  campus: string;
  gradeLevel: string;
  details: string;
  concepts: string[];
  authorName: string;
  authorSchool: string;
  tags: string[];
  attachment: {
    type: "link" | "file";
    url?: string;
    fileName?: string;
  } | null;
  university: University;
  date: string;
}

// Sample data
const sampleData: QuestionResource[] = [
  {
    id: 1,
    title: "Understanding Calculus I - Derivatives and Limits",
    type: "Resource",
    topic: "Mathematics",
    school: "College of Engineering",
    campus: "North Campus",
    gradeLevel: "Freshman",
    details:
      "Comprehensive study guide covering fundamental concepts of derivatives, limits, and continuity with practice problems.",
    concepts: ["Derivatives", "Limits", "Continuity", "Chain Rule"],
    authorName: "Sarah Johnson",
    authorSchool: "University of Michigan",
    tags: ["Calculus", "Math", "Study Guide", "Derivatives"],
    attachment: {
      type: "link",
      url: "https://example.com/calculus-guide.pdf",
    },
    university: "UMich",
    date: "2026-02-05",
  },
  {
    id: 2,
    title: "How do I approach organic chemistry synthesis problems?",
    type: "Question",
    topic: "Chemistry",
    school: "College of Literature, Science, and the Arts",
    campus: "Central Campus",
    gradeLevel: "Sophomore",
    details:
      "I struggle with multi-step synthesis problems. What strategies can help me identify the right reagents and reaction pathways?",
    concepts: ["Synthesis", "Reagents", "Reaction Mechanisms"],
    authorName: "Michael Chen",
    authorSchool: "Harvard University",
    tags: ["Organic Chemistry", "Synthesis", "Help Needed"],
    attachment: {
      type: "file",
      fileName: "synthesis-problem.png",
    },
    university: "Harvard",
    date: "2026-02-06",
  },
  {
    id: 3,
    title: "Introduction to Machine Learning - Complete Notes",
    type: "Resource",
    topic: "Computer Science",
    school: "School of Engineering",
    campus: "Main Campus",
    gradeLevel: "Junior",
    details:
      "Full semester notes covering supervised learning, neural networks, and practical implementation with Python.",
    concepts: ["Machine Learning", "Neural Networks", "Python", "AI"],
    authorName: "Emma Davis",
    authorSchool: "Stanford University",
    tags: ["ML", "AI", "Python", "Notes", "Computer Science"],
    attachment: {
      type: "link",
      url: "https://example.com/ml-notes",
    },
    university: "Stanford",
    date: "2026-02-04",
  },
];

export default function ApprovedQuestionsResources() {
  const [selectedUniversity, setSelectedUniversity] = useState<
    University | "All"
  >("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"All" | "Question" | "Resource">(
    "All",
  );

  const universities: { name: University; color: string; accent: string }[] = [
    { name: "Harvard", color: "#A51C30", accent: "#FFF" },
    { name: "Stanford", color: "#8C1515", accent: "#FFF" },
    { name: "UMich", color: "#00274C", accent: "#FFCB05" },
  ];

  const filteredData = sampleData.filter((item) => {
    const matchesUniversity =
      selectedUniversity === "All" || item.university === selectedUniversity;
    const matchesType = filterType === "All" || item.type === filterType;
    const matchesSearch =
      searchTerm === "" ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      );

    return matchesUniversity && matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#00274C] dark:bg-gray-900 py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white p-10 rounded-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Approved Questions & Resources
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Browse and discover community-approved educational content
          </p>
        </div>

        {/* University Selector */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Choose Your Institution
          </h2>
          <div className="flex flex-wrap gap-3 text-xs">
            <button
              onClick={() => setSelectedUniversity("All")}
              className={`px-4 py-2 rounded-[5px] font-medium transition-all duration-200 ${
                selectedUniversity === "All"
                  ? "bg-gray-900 text-white shadow-lg scale-105"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              All Universities
            </button>
            {universities.map((uni) => (
              <button
                key={uni.name}
                onClick={() => setSelectedUniversity(uni.name)}
                className={`px-4 py-2 rounded-[5px] font-medium transition-all duration-200 flex items-center gap-2 ${
                  selectedUniversity === uni.name
                    ? "shadow-lg scale-105"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
                style={
                  selectedUniversity === uni.name
                    ? { backgroundColor: uni.color, color: uni.accent }
                    : {}
                }
              >
                <div
                  className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: uni.color, color: uni.accent }}
                >
                  {uni.name.charAt(0)}
                </div>
                {uni.name}
              </button>
            ))}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 text">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by title, topic, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-[5px] border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00274C] dark:focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2 text-xs">
            <button
              onClick={() => setFilterType("All")}
              className={`px-4 py-2 rounded-[5px] font-medium transition-all duration-200 ${
                filterType === "All"
                  ? "bg-[#00274C] text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType("Question")}
              className={`px-4 py-2 rounded-[5px] font-medium transition-all duration-200 ${
                filterType === "Question"
                  ? "bg-[#00274C] text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              Questions
            </button>
            <button
              onClick={() => setFilterType("Resource")}
              className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                filterType === "Resource"
                  ? "bg-[#00274C] text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              Resources
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-xs text-gray-600 dark:text-gray-400">
          Showing {filteredData.length}{" "}
          {filteredData.length === 1 ? "result" : "results"}
        </div>

        {/* List of Questions/Resources */}
        <div className="space-y-4">
          {filteredData.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No results found. Try adjusting your filters.
              </p>
            </div>
          ) : (
            filteredData.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:scale-[1.01] cursor-pointer"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {item.title}
                      </h3>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.type === "Question"
                            ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                            : "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                        }`}
                      >
                        {item.type}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-xs line-clamp-2">
                      {item.details}
                    </p>
                  </div>
                </div>

                {/* Essential Info */}
                <div className="flex flex-wrap items-center gap-4 text-xs mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 dark:text-gray-400">
                      Topic:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {item.topic}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 dark:text-gray-400">
                      By:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {item.authorName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded flex items-center justify-center text-xs font-bold"
                      style={{
                        backgroundColor:
                          universities.find((u) => u.name === item.university)
                            ?.color || "#000",
                        color:
                          universities.find((u) => u.name === item.university)
                            ?.accent || "#FFF",
                      }}
                    >
                      {item.university.charAt(0)}
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {item.authorSchool}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span>{item.gradeLevel}</span>
                    <span>•</span>
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                    {item.attachment && (
                      <>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          {item.attachment.type === "link" ? (
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                              />
                            </svg>
                          )}
                          <span>Attachment</span>
                        </div>
                      </>
                    )}
                  </div>
                  <Button variant="default" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
