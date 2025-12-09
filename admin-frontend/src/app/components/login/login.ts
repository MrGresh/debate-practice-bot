import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule, 
    RouterModule,
    NgIf
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  credentials = {
    adminId: '',
    password: ''
  };
  errorMessage: string | null = null;
  
  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.errorMessage = null;
    
    if (!this.credentials.adminId || !this.credentials.password) {
      this.errorMessage = 'Please enter both Admin ID and Password.';
      return;
    }

    this.authService.login(this.credentials.adminId, this.credentials.password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.errorMessage = err.error?.message || err.message || 'Login failed. Check your credentials.';
      }
    });
  }
}