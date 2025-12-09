import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  { path: 'login', component: Login },
  
  { path: 'dashboard', component: Dashboard },

  // Wildcard route for 404
  { path: '**', redirectTo: 'login' },
];