// Profile type (matches backend ProfileResponse / API)
export interface Profile {
  profile_id?: number;
  id: string;
  full_name: string;
  username: string;
  roll_number: string;
  year_of_study: number;
  branch: string;
  blood_group: string;
  created_at?: string | null;
  profile_picture_url?: string | null;
  bio?: string | null;
  skills?: string | null;
  projects?: string | null;
  contact_info?: string | null;
  social_media_links?: string | null;
  volunteering_exp?: string | null;
}

// Type for the signup form data
export interface SignUpFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  rollNumber: string;
  yearOfStudy: number;
  branch: string;
  bloodGroup: string;
}

// Options for blood groups
export const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

// Options for branches
export const branchOptions = [
  'Computer Science',
  'Mechanical Engineering',
  'Electrical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Electronics and Communication',
  'Information Technology',
  'Other'
];

// Options for year of study
export const yearOfStudyOptions = [1, 2, 3, 4, 5];
