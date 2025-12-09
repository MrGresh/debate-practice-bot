import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_CONSTANTS } from '../constants';

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    adminId: string;
    _id: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  login(adminId: string, password: string): Observable<LoginResponse> {
    const payload = { adminId, password };

    return this.http.post<LoginResponse>(API_CONSTANTS.ADMIN_LOGIN_URL, payload).pipe(
      tap(response => {
        if (response.success) {
          console.log('Login successful.');
        }
      })
    );
  }

  logout(): void {
    console.log('Admin logged out.');
  }
}