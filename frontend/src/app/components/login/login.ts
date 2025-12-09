import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services';
import { ToastrService } from 'ngx-toastr';
import { ApiResInterfaces } from '../../interfaces';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink], 
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  loginForm: FormGroup;
  isLoading: boolean = false;
  
  isPasswordVisible: boolean = false; 

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.toastr.error('Please fix the highlighted errors in the form.', 'Validation Error'); 
      return;
    }

    this.isLoading = true;
    const payload = this.loginForm.value;

    this.authService.login(payload).pipe(
      catchError((err) => {
        const message = err.error?.message || 'Login failed. Please try again.';
        this.toastr.error(message, 'Login Failed');
        this.isLoading = false;
        return [];
      })
    ).subscribe((response: ApiResInterfaces.LoginResponse) => {
      this.isLoading = false;
      if (response.success && response.data?.token) {
        this.toastr.success('Login successful! Redirecting to dashboard.', 'Welcome!'); 
        this.authService.setToken(response.data.token);
        this.router.navigate(['/dashboard']);
      } else {
        const message = response.message || 'Login failed due to an unknown error.';
        this.toastr.error(message, 'Login Failed');
      }
    });
  }
}