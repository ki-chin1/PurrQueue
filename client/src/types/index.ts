// User Types
export type UserRole = 'USER' | 'ADMIN' | 'CATTERY_ADMIN';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: User;
}

// Cat Types
export interface Cat {
  id: number;
  cattery_id: number;
  name: string;
  breed?: string;
  age_months?: number;
  gender: 'MALE' | 'FEMALE';
  color?: string;
  description?: string;
  type: 'ADOPTION' | 'SALE';
  price?: number;
  status: 'AVAILABLE' | 'PENDING' | 'ADOPTED' | 'SOLD';
  created_at: string;
  updated_at: string;
}

export interface CatsResponse {
  success: boolean;
  count: number;
  data: Cat[];
}

// Application Types
export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Application {
  id: number;
  cat_id: number;
  user_id: number;
  application_message?: string;
  message?: string;
  status: ApplicationStatus;
  applied_at: string;
  created_at?: string;
  monthly_income?: number;
  current_cats_count: number;
  has_dog: boolean;
  housing_type?: 'RENT' | 'OWN';
  house_size_sqm?: number;
  has_children: boolean;
  experience_with_cats?: string;
  experience?: string;
  cat?: Cat;
  user?: User;
}

export interface ApplicationsResponse {
  success: boolean;
  count: number;
  data: Application[];
}

// Image Types
export interface CatImage {
  id: number;
  cat_id: number;
  image_url: string;
  created_at: string;
}

export interface ImagesResponse {
  success: boolean;
  count: number;
  data: CatImage[];
}

// API Error Response
export interface ApiError {
  error: string;
  message: string;
}

// Auth Context Type
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
