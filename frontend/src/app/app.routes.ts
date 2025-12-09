import { Routes } from '@angular/router';
import { authGuard } from './guards';
import { Login, Register, ForgotPassword, Dashboard } from './components';

export const routes: Routes = [
  // Public Routes
  { path: 'login', component: Login, title: 'Login' },
  { path: 'register', component: Register, title: 'Register' },
  { path: 'forgot-password', component: ForgotPassword, title: 'Forgot Password' },

  // Protected Route
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard], title: 'Dashboard' },

  // Default Redirect
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  
  // Wildcard route for 404 (optional)
  { path: '**', redirectTo: '/login' },
];