export interface User {
  id: string;
  username: string;
  displayName: string;
  department: string;
  avatar?: string;
  email?: string;
  phone?: string;
  role: string;
  permissions: string[];
  lastLoginAt?: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: 'ko' | 'en';
  notifications: {
    email: boolean;
    push: boolean;
    sound: boolean;
  };
}

export interface UserMenuState {
  isOpen: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}