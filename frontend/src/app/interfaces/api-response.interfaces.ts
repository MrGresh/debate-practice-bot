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
