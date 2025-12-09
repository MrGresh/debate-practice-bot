import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services';
import { catchError, map, of } from 'rxjs';
import { getToken, removeToken } from '../utils';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = getToken();

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  return authService.validateToken(token).pipe(
    map((response) => {
      return true;
    }),
    catchError((error) => {
      console.error('Token validation failed:', error);
      removeToken();
      
      router.navigate(['/login']);
      return of(false);
    })
  );
};