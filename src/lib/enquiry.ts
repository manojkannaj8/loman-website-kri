import { projectTypes } from "./content";

// Shared by the client form and the /api/enquiry route so both enforce the
// same rules.
export const PLAN_LIMITS = {
  maxFiles: 5,
  maxBytes: 20 * 1024 * 1024,
  accept: "application/pdf",
} as const;

export type EnquiryFields = {
  name: string;
  email: string;
  phone: string;
  location: string;
  projectType: string;
  message: string;
};

export type FieldErrors = Partial<Record<keyof EnquiryFields | "plans", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateFields(f: EnquiryFields): FieldErrors {
  const errors: FieldErrors = {};
  if (!f.name.trim()) errors.name = "Please enter your name.";
  else if (f.name.length > 120) errors.name = "Name is too long.";

  if (!f.email.trim()) errors.email = "Please enter your email.";
  else if (!EMAIL_RE.test(f.email.trim())) errors.email = "That email doesn't look right.";

  if (f.phone && !/^[+\d\s()-]{6,24}$/.test(f.phone.trim()))
    errors.phone = "Use digits, spaces and + only.";

  if (f.location.length > 120) errors.location = "Location is too long.";

  if (!f.projectType) errors.projectType = "Choose a project type.";
  else if (!(projectTypes as readonly string[]).includes(f.projectType))
    errors.projectType = "Choose a project type from the list.";

  if (!f.message.trim()) errors.message = "Tell us a little about the project.";
  else if (f.message.length > 5000) errors.message = "Please keep this under 5,000 characters.";

  return errors;
}

type FileLike = { name: string; size: number; type: string };

export function validatePlans(files: FileLike[]): string | undefined {
  if (files.length > PLAN_LIMITS.maxFiles) return `Up to ${PLAN_LIMITS.maxFiles} files.`;
  for (const file of files) {
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) return `${file.name} isn't a PDF.`;
    if (file.size > PLAN_LIMITS.maxBytes) return `${file.name} is over 20 MB.`;
  }
  return undefined;
}

export function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
