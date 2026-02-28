import * as yup from "yup";

// Submission form validation schema
export const submissionSchema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required")
    .min(5, "Title must be at least 5 characters"),
  postType: yup
    .string()
    .oneOf(["Question", "Resource"], "Invalid post type")
    .required("Post type is required"),
  topic: yup.string().required("Topic is required"),
  school: yup.string().required("School is required"),
  campus: yup.string().required("Campus is required"),
  gradeLevel: yup.string().required("Grade level is required"),
  details: yup
    .string()
    .required("Details are required")
    .min(20, "Please provide more details (at least 20 characters)"),
  yourName: yup
    .string()
    .transform((value) => value || undefined)
    .defined(),
  yourSchool: yup
    .string()
    .transform((value) => value || undefined)
    .defined(),
  tags: yup
    .string()
    .transform((value) => value || undefined)
    .defined(),
  linkUrl: yup
    .string()
    .url("Please enter a valid URL")
    .nullable()
    .transform((value) => value || undefined)
    .defined(),
  files: yup
    .mixed()
    .nullable()
    .transform((value) => value || undefined)
    .defined(),
});

// Admin & User login validation schema
export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

// User registration validation schema
export const registerSchema = yup.object().shape({
  firstName: yup
    .string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters"),
  lastName: yup
    .string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

// Topic management schema
export const topicSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  description: yup
    .string()
    .transform((value) => value || undefined)
    .defined(),
  is_active: yup.boolean().default(true),
});

// School management schema
export const schoolSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  abbreviation: yup
    .string()
    .transform((value) => value || undefined)
    .defined(),
  is_active: yup.boolean().default(true),
});

// Campus management schema
export const campusSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  location: yup
    .string()
    .transform((value) => value || undefined)
    .defined(),
  is_active: yup.boolean().default(true),
});

// Grade level management schema
export const gradeLevelSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  order_index: yup
    .number()
    .transform((value) => value || undefined)
    .defined(),
  is_active: yup.boolean().default(true),
});

export type SubmissionFormData = {
  title: string;
  postType: "Question" | "Resource";
  topic: string;
  school: string;
  campus: string;
  gradeLevel: string;
  details: string;
  yourName: string;
  yourSchool: string;
  tags: string;
  linkUrl: string | null;
  files: any | null;
};
export type LoginFormData = yup.InferType<typeof loginSchema>;
export type RegisterFormData = yup.InferType<typeof registerSchema>;
export type TopicFormData = yup.InferType<typeof topicSchema>;
export type SchoolFormData = yup.InferType<typeof schoolSchema>;
export type CampusFormData = yup.InferType<typeof campusSchema>;
export type GradeLevelFormData = yup.InferType<typeof gradeLevelSchema>;
