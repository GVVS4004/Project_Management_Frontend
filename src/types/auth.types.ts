export interface User {
    id: number;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: 'ADMIN' | 'MANAGER' | 'MEMBER';
    enabled: boolean;
    profileImageUrl?: string;
    createdAt: string;
    updatedAt: string;
  }

  export interface LoginRequest {
    email: string;
    password: string;
  }

  export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    role?: 'ADMIN' | 'MANAGER' | 'MEMBER';
  }

  export interface AuthResponse {
    accessToken: string;
    refreshToken?: string;
    tokenType: string;
    expiresIn: number;
    user: User;
  }

  export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    timestamp: string;
  }

  export interface UpdateProfileRequest {
    username?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
  }
  export interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }

  export interface MediaUploadResponse {
    id: number;
    fileName: string;
    fileType: string;
    fileSize: number;
    uploadedAt: string;
    downloadUrl: string;
  }