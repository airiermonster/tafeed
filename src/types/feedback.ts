
export interface FeedbackFormData {
  fullName: string;
  phoneNumber: string;
  email: string;
  region: string;
  district: string;
  ward: string;
  street: string;
  category: string;
  description: string;
}

export interface FeedbackSubmission {
  id: string;
  user_id: string;
  status: 'pending' | 'reviewing' | 'resolved' | 'rejected';
  tracking_id: string;
  created_at: string;
  updated_at: string;
  full_name: string | null;
  phone_number: string | null;
  email: string | null;
  region: string;
  district: string | null;
  ward: string | null;
  street: string | null;
  category: string;
  description: string;
}

export interface FeedbackEvidence {
  id: string;
  feedback_id: string;
  file_path: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

// Define a UserRole type
export type UserRole = 'admin' | 'moderator' | 'user';

// Define a UserRoles interface
export interface UserRoleRecord {
  id: string;
  user_id: string;
  role: UserRole;
  created_at: string;
}
