import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { API_CONSTANTS } from '../constants';
import {
  RegisterRequest,
  RegisterResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  ResendOtpRequest,
  ResendOtpResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  ForgotPasswordSendOtpRequest,
  ForgotPasswordSendOtpResponse,
  ForgotPasswordResetRequest,
  ForgotPasswordResetResponse,
  ValidateTokenResponse,
} from '../interfaces/api.interfaces';

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

  register(payload: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(API_CONSTANTS.USER_REGISTER, payload);
  }

  verifyOtp(payload: VerifyOtpRequest): Observable<VerifyOtpResponse> {
    return this.http.post<VerifyOtpResponse>(
      API_CONSTANTS.USER_VERIFY_OTP,
      payload
    );
  }

  resendOtp(payload: ResendOtpRequest): Observable<ResendOtpResponse> {
    return this.http.post<ResendOtpResponse>(
      API_CONSTANTS.USER_RESEND_OTP,
      payload
    );
  }

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(API_CONSTANTS.USER_LOGIN, payload);
  }

  forgotPasswordSendOtp(
    payload: ForgotPasswordSendOtpRequest
  ): Observable<ForgotPasswordSendOtpResponse> {
    return this.http.post<ForgotPasswordSendOtpResponse>(
      API_CONSTANTS.FORGOT_PASSWORD_SEND_OTP,
      payload
    );
  }

  forgotPasswordReset(
    payload: ForgotPasswordResetRequest
  ): Observable<ForgotPasswordResetResponse> {
    return this.http.post<ForgotPasswordResetResponse>(
      API_CONSTANTS.FORGOT_PASSWORD_RESET,
      payload
    );
  }

  // --- Protected APIs ---

  validateToken(token: string): Observable<ValidateTokenResponse> {
    return this.http.get<ValidateTokenResponse>(
      API_CONSTANTS.VALIDATE_TOKEN,
      { headers: this.getAuthHeaders(token) }
    );
  }

  logout(token: string): Observable<LogoutResponse> {
    // Logout is a protected route in your backend
    return this.http.post<LogoutResponse>(
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