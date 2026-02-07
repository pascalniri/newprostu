// Database types
export interface Submission {
  id: string;
  title: string;
  post_type: "Question" | "Resource";
  topic: string;
  school: string;
  campus: string;
  grade_level: string;
  details: string;
  author_name: string | null;
  author_school: string | null;
  tags: string[];
  attachment_type: "link" | "file" | null;
  attachment_url: string | null;
  attachment_filename: string | null;
  status: "pending" | "reviewing";
  created_at: string;
  updated_at: string;
}

export interface ApprovedContent {
  id: string;
  submission_id: string | null;
  title: string;
  post_type: "Question" | "Resource";
  topic: string;
  school: string;
  campus: string;
  grade_level: string;
  details: string;
  author_name: string | null;
  author_school: string | null;
  university: "Harvard" | "Stanford" | "UMich";
  tags: string[];
  attachment_type: "link" | "file" | null;
  attachment_url: string | null;
  attachment_filename: string | null;
  approved_by: string | null;
  approved_at: string;
  created_at: string;
}

export interface Admin {
  id: string;
  email: string;
  created_at: string;
}

// Form data type
export interface SubmissionFormData {
  title: string;
  postType: "Question" | "Resource";
  topic: string;
  school: string;
  campus: string;
  gradeLevel: string;
  details: string;
  yourName?: string;
  yourSchool?: string;
  tags: string;
  linkUrl?: string;
  file?: File;
}

// API Response types
export interface SubmissionResponse {
  success: boolean;
  message: string;
  submissionId?: string;
}

export interface ApprovalRequest {
  submissionId: string;
  action: "approve" | "reject";
  university?: "Harvard" | "Stanford" | "UMich";
}

export interface ContentFilters {
  university?: string;
  type?: "Question" | "Resource";
  topic?: string;
  search?: string;
}
