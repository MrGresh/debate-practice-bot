export interface BaseResponse<T = {}> {
  success: boolean;
  message: string;
  data?: T;
}

export interface User {
  _id: string;
  name: string;
  email: string;
}

// --- Request Interfaces ---

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResendOtpRequest {
  email: string;
}

export interface ForgotPasswordSendOtpRequest {
  email: string;
}

export interface ForgotPasswordResetRequest {
  email: string;
  otp: string;
  newPassword: string;
}

// --- Response Interfaces ---

export interface RegisterResponseData {
  userId: string;
}

export interface LoginResponseData {
  user: User;
  token: string;
}

export interface ForgotPasswordSendOtpResponseData {
  email: string;
}

export interface ForgotPasswordResetResponseData {
  userId: string;
}

export interface ValidateTokenResponseData {
  user: User;
}

export type RegisterResponse = BaseResponse<RegisterResponseData>;
export type VerifyOtpResponse = BaseResponse;
export type ResendOtpResponse = BaseResponse;
export type LoginResponse = BaseResponse<LoginResponseData>;
export type LogoutResponse = BaseResponse;
export type ValidateTokenResponse = BaseResponse<ValidateTokenResponseData>;
export type ForgotPasswordSendOtpResponse = BaseResponse<ForgotPasswordSendOtpResponseData>;
export type ForgotPasswordResetResponse = BaseResponse<ForgotPasswordResetResponseData>;