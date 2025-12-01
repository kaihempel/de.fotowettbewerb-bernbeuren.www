import { InertiaLinkProps } from "@inertiajs/react";
import { LucideIcon } from "lucide-react";

export interface Auth {
  user: User;
}

export interface BreadcrumbItem {
  title: string;
  href: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface NavItem {
  title: string;
  href: NonNullable<InertiaLinkProps["href"]>;
  icon?: LucideIcon | null;
  isActive?: boolean;
}

export interface SharedData {
  name: string;
  quote: { message: string; author: string };
  auth: Auth;
  sidebarOpen: boolean;
  hcaptcha_sitekey: string;
  locale: string;
  locales: string[];
  cookies_accepted: boolean;
  [key: string]: unknown;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  email_verified_at: string | null;
  two_factor_enabled?: boolean;
  created_at: string;
  updated_at: string;
  [key: string]: unknown; // This allows for additional properties...
}

export interface PhotoSubmission {
  id: number;
  fwb_id: string;
  user_id: number;
  original_filename: string;
  stored_filename: string;
  file_path: string;
  file_size: number;
  file_hash: string;
  mime_type: string;
  photographer_name: string | null;
  photographer_email: string | null;
  status: "new" | "approved" | "declined";
  rate: number | null;
  submitted_at: string;
  reviewed_at: string | null;
  reviewed_by: number | null;
  created_at: string;
  updated_at: string;
  file_url: string;
  user?: User;
  reviewer?: User;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface GalleryPhoto {
  id: number;
  thumbnail_url: string;
  full_image_url: string;
  rate: number | null;
  created_at: string;
}

export interface GalleryPageProps {
  photos: GalleryPhoto[];
  next_cursor: string | null;
  has_more: boolean;
}
