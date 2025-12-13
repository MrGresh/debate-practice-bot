import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services';
import { ToastrService } from 'ngx-toastr';
import { ApiResInterfaces } from '../../interfaces';
import { catchError } from 'rxjs';
import { getToken, setToken } from '../../utils';

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

  ngOnInit(): void{
    this._checkExistingSession();
  }

  private _checkExistingSession(): void {
    const token = getToken();

    if (token) {
      this.isLoading = true;
      this.authService.validateToken(token).pipe(
        catchError((err) => {
          const message = err.error?.message || 'Session expired or invalid. Please log in again.';
          this.toastr.warning(message, 'Session Check');
          this.isLoading = false;
          return [];
        })
      ).subscribe((response: ApiResInterfaces.ValidateTokenResponse) => {
        this.isLoading = false;
        if (response.success && response.data?.user) {
          this.toastr.info('You are already logged in. Redirecting to dashboard.', 'Session Active');
          this.router.navigate(['/dashboard']);
        } else {
          const message = response.message || 'Session check failed. Please log in.';
          this.toastr.warning(message, 'Session Check');
        }
      });
    }
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
        setToken(response.data.token);
        this.router.navigate(['/dashboard']);
      } else {
        const message = response.message || 'Login failed due to an unknown error.';
        this.toastr.error(message, 'Login Failed');
      }
    });
  }
}