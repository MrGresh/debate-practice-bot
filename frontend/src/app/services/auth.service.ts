import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { API_CONSTANTS } from '../constants';
import { ApiReqInterfaces, ApiResInterfaces } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  private getAuthHeaders(token?: string): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

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
      { headers: this.getAuthHeaders(token) }
    );
  }

  logout(token: string): Observable<ApiResInterfaces.LogoutResponse> {
    return this.http.post<ApiResInterfaces.LogoutResponse>(
      API_CONSTANTS.USER_LOGOUT,
      {},
      { headers: this.getAuthHeaders(token) }
    );
  }

  // --- Auth State Management ---

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  removeToken(): void {
    localStorage.removeItem('auth_token');
  }

  // Function for the Auth Guard
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }
}