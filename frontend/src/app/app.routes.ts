import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { ForgotPassword } from './components/forgot-password/forgot-password';
import { Dashboard } from './components/dashboard/dashboard';
import { authGuard } from './guards/auth.guard';

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