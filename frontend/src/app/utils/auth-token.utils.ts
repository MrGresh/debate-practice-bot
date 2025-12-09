import { HttpHeaders } from '@angular/common/http';

export function getAuthHeaders(token?: string): HttpHeaders {
  let headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }
  return headers;
}

// --- Auth State Management ---

export function getToken(): string | null {
  return localStorage.getItem('auth_token');
}

export function setToken(token: string): void {
  localStorage.setItem('auth_token', token);
}

export function removeToken(): void {
  localStorage.removeItem('auth_token');
}
