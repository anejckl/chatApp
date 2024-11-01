export interface User {
  id: number;
  username: string;
  mail: string;
  created: string;
  role_level: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  sessionExpire: number;
  token: string;
}

export interface CheckAuthResponse {
  isAuthenticated: boolean;
  user?: User;
}

export interface RegistrationRequest {
  username: string;
  email: string;
  password: string;
}

export interface RegistrationResponse {
  message: string;
  user: User;
}

export interface UniversalResponse {
  message: string;
}