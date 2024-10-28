export interface User {
  id: number;
  username: string;
  email: string;
  created: string;
  role: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  sessionExpire: number;
}

export interface CheckAuthResponse {
  isAuthenticated: boolean;
  user?: User;
}
