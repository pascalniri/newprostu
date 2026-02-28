// Database types
export interface Submission {
  university: string;
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
  view_count?: number; // Optional since Submissions might not have views tracked yet
  votes?: number; // Added to prevent TS errors
  answers_count?: number; // Added to prevent TS errors
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
  university: string;
  tags: string[];
  attachment_type: "link" | "file" | null;
  attachment_url: string | null;
  attachment_filename: string | null;
  approved_by: string | null;
  approved_at: string;
  created_at: string;
  view_count: number;
  votes?: number; // Added to prevent TS errors
  answers_count?: number; // Added to prevent TS errors
}

export interface Bookmark {
  id: string;
  user_id: string;
  content_id: string;
  created_at: string;
}

export interface Vote {
  id: string;
  user_id: string;
  content_id: string | null;
  comment_id: string | null;
  vote_type: 1 | -1;
  created_at: string;
}

export interface Admin {
  id: string;
  email: string;
  created_at: string;
}

// Form data type

// API Response types
export interface SubmissionResponse {
  success: boolean;
  message: string;
  submissionId?: string;
}

export interface ApprovalRequest {
  submissionId: string;
  action: "approve" | "reject";
  university?: string;
}

export interface ContentFilters {
  university?: string;
  type?: "Question" | "Resource";
  topic?: string;
  search?: string;
}

export interface University {
  id: string;
  name: string;
  abbreviation: string;
  color_primary: string;
  color_secondary: string;
  latitude: number | null;
  longitude: number | null;
  is_active: boolean;
  logo_url: string | null;
  gallery_urls: string[];
  created_at: string;
  updated_at: string;
}
