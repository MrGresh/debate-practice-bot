import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONSTANTS } from '../constants';
import { ApiReqInterfaces, ApiResInterfaces } from '../interfaces';
import { getAuthHeaders } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  // --- Public APIs ---

  register(payload: ApiReqInterfaces.RegisterRequest): Observable<ApiResInterfaces.RegisterResponse> {
    return this.http.post<ApiResInterfaces.RegisterResponse>(API_CONSTANTS.USER_REGISTER, payload);
  }

  verifyOtp(payload: ApiReqInterfaces.VerifyOtpRequest): Observable<ApiResInterfaces.VerifyOtpResponse> {
    return this.http.post<ApiResInterfaces.VerifyOtpResponse>(
      API_CONSTANTS.USER_VERIFY_OTP,
      payload
    );
  }

  resendOtp(payload: ApiReqInterfaces.ResendOtpRequest): Observable<ApiResInterfaces.ResendOtpResponse> {
    return this.http.post<ApiResInterfaces.ResendOtpResponse>(
      API_CONSTANTS.USER_RESEND_OTP,
      payload
    );
  }

  login(payload: ApiReqInterfaces.LoginRequest): Observable<ApiResInterfaces.LoginResponse> {
    return this.http.post<ApiResInterfaces.LoginResponse>(API_CONSTANTS.USER_LOGIN, payload);
  }

  forgotPasswordSendOtp(
    payload: ApiReqInterfaces.ForgotPasswordSendOtpRequest
  ): Observable<ApiResInterfaces.ForgotPasswordSendOtpResponse> {
    return this.http.post<ApiResInterfaces.ForgotPasswordSendOtpResponse>(
      API_CONSTANTS.FORGOT_PASSWORD_SEND_OTP,
      payload
    );
  }

  forgotPasswordReset(
    payload: ApiReqInterfaces.ForgotPasswordResetRequest
  ): Observable<ApiResInterfaces.ForgotPasswordResetResponse> {
    return this.http.post<ApiResInterfaces.ForgotPasswordResetResponse>(
      API_CONSTANTS.FORGOT_PASSWORD_RESET,
      payload
    );
  }

  // --- Protected APIs ---

  validateToken(token: string): Observable<ApiResInterfaces.ValidateTokenResponse> {
    return this.http.get<ApiResInterfaces.ValidateTokenResponse>(
      API_CONSTANTS.VALIDATE_TOKEN,
      { headers: getAuthHeaders(token) }
    );
  }

  logout(token: string): Observable<ApiResInterfaces.LogoutResponse> {
    return this.http.post<ApiResInterfaces.LogoutResponse>(
      API_CONSTANTS.USER_LOGOUT,
      {},
      { headers: getAuthHeaders(token) }
    );
  }
}