import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ApiResInterfaces } from '../../interfaces';
import { catchError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';

function passwordMatchValidator(
  control: AbstractControl
): { [key: string]: boolean } | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { passwordsNotMatching: true };
  }
  return null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  step: 'register' | 'otp' = 'register';
  registeredEmail: string = '';
  isLoading: boolean = false;
  otpResent: boolean = false;

  isPasswordVisible: boolean = false;
  isConfirmPasswordVisible: boolean = false;

  registerForm: FormGroup;
  otpForm: FormGroup;

  constructor() {
    this.registerForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: passwordMatchValidator }
    );

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });
  }

  get regF() {
    return this.registerForm.controls;
  }
  get otpF() {
    return this.otpForm.controls;
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.isPasswordVisible = !this.isPasswordVisible;
    } else {
      this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
    }
  }

  onSubmitRegister(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.toastr.error('Please fix the highlighted errors in the form.', 'Validation Error');
      return;
    }

    if (this.registerForm.errors?.['passwordsNotMatching']) {
      this.toastr.error('Password and Confirm Password must match.', 'Validation Error');
      return;
    }

    this.isLoading = true;
    const payload = {
        name: this.regF['name'].value,
        email: this.regF['email'].value,
        password: this.regF['password'].value,
    };

    this.authService.register(payload).pipe(
      catchError((err) => {
        const message = err.error?.message || 'Registration failed. Please try again.';
        this.toastr.error(message, 'Registration Failed');
        this.isLoading = false;
        return [];
      })
    ).subscribe((response: ApiResInterfaces.RegisterResponse) => {
      this.isLoading = false;
      if (response.success) {
        this.registeredEmail = payload.email;
        this.toastr.success(response.message || 'OTP sent. Please check your email to verify your account.', 'Success');
        this.step = 'otp';
      } else {
        this.toastr.error(response.message || 'Registration failed.', 'Registration Failed');
      }
    });
  }

  onSubmitOtp(): void {
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      this.toastr.error('Please enter the 6-digit OTP.', 'Validation Error');
      return;
    }

    this.isLoading = true;
    const payload = {
      email: this.registeredEmail,
      otp: this.otpForm.value.otp,
    };

    this.authService.verifyOtp(payload).pipe(
      catchError((err) => {
        const message = err.error?.message || 'OTP verification failed. Please try again.';
        this.toastr.error(message, 'Verification Failed');
        this.isLoading = false;
        return [];
      })
    ).subscribe((response: ApiResInterfaces.VerifyOtpResponse) => {
      this.isLoading = false;
      if (response.success) {
        this.toastr.success(response.message || 'Account verified successfully! Redirecting to login...', 'Success');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      } else {
        this.toastr.error(response.message || 'OTP verification failed.', 'Verification Failed');
      }
    });
  }

  resendOtp(): void {
    this.otpResent = false;

    const payload = {
      email: this.registeredEmail,
    };

    this.authService.resendOtp(payload).pipe(
      catchError((err) => {
        const message = err.error?.message || 'Failed to resend OTP.';
        this.toastr.error(message, 'Resend Failed');
        return [];
      })
    ).subscribe((response: ApiResInterfaces.ResendOtpResponse) => {
      if (response.success) {
        this.toastr.success(response.message || 'New OTP sent. Check your email.', 'OTP Sent');
        this.otpResent = true;
      } else {
        this.toastr.error(response.message || 'Failed to resend OTP.', 'Resend Failed');
      }
    });
  }
}