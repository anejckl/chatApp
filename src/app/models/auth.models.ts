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
}

export interface CheckAuthResponse {
  isAuthenticated: boolean;
  user?: User;
}
