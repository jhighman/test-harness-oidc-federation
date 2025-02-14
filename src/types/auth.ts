export interface User {
  givenName: string;
  familyName: string;
  email: string;
  password: string;
  phoneNumber: string;
  emailVerified: boolean;
  phoneNumberVerified: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: Omit<User, 'password'>;
}

export interface RegisterFormData {
  givenName: string;
  familyName: string;
  email: string;
  password: string;
  phoneNumber: string;
} 