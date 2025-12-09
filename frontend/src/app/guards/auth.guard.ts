import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();

  if (!token) {
    // 1. If no token exists, navigate to login
    router.navigate(['/login']);
    return false;
  }

  // 2. If token exists, call validateToken to check expiry/validity
  return authService.validateToken(token).pipe(
    map((response) => {
      // If validation is successful
      return true;
    }),
    catchError((error) => {
      // If validation fails (token expired, invalid, etc.)
      console.error('Token validation failed:', error);
      authService.removeToken();
      
      // Navigate to login on failure
      router.navigate(['/login']);
      return of(false);
    })
  );
};