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
