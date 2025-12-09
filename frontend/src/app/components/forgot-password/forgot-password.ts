import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ForgotPasswordSendOtpResponse, ForgotPasswordResetResponse } from '../../interfaces/api.interfaces';
import { catchError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';

function passwordMatchValidator(
  control: AbstractControl
): { [key: string]: boolean } | null {
  const password = control.get('newPassword');
  const confirmPassword = control.get('confirmNewPassword');

  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { passwordsNotMatching: true };
  }
  return null;
}

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  step: 'send-otp' | 'reset-password' = 'send-otp';
  resetEmail: string = '';
  isLoading: boolean = false;
  
  isNewPasswordVisible: boolean = false;
  isConfirmNewPasswordVisible: boolean = false;

  sendOtpForm: FormGroup;
  resetPasswordForm: FormGroup;

  constructor() {
    this.sendOtpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.resetPasswordForm = this.fb.group(
      {
        otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmNewPassword: ['', Validators.required],
      },
      { validators: passwordMatchValidator }
    );
  }

  get sendF() {
    return this.sendOtpForm.controls;
  }
  get resetF() {
    return this.resetPasswordForm.controls;
  }

  togglePasswordVisibility(field: 'newPassword' | 'confirmNewPassword'): void {
    if (field === 'newPassword') {
      this.isNewPasswordVisible = !this.isNewPasswordVisible;
    } else {
      this.isConfirmNewPasswordVisible = !this.isConfirmNewPasswordVisible;
    }
  }

  onSubmitSendOtp(): void {
    if (this.sendOtpForm.invalid) {
      this.sendOtpForm.markAllAsTouched();
      this.toastr.error('Please enter a valid email address.', 'Validation Error');
      return;
    }

    this.isLoading = true;
    const payload = this.sendOtpForm.value;

    this.authService.forgotPasswordSendOtp(payload).pipe(
      catchError((err) => {
        const message = err.error?.message || 'Failed to send OTP. Please check the email.';
        this.toastr.error(message, 'Request Failed');
        this.isLoading = false;
        return [];
      })
    ).subscribe((response: ForgotPasswordSendOtpResponse) => {
      this.isLoading = false;
      if (response.success && response.data?.email) {
        this.resetEmail = response.data.email;
        this.toastr.success(response.message || 'OTP sent successfully. Check your email.', 'OTP Sent');
        this.step = 'reset-password';
      } else {
        this.toastr.error(response.message || 'Failed to send OTP.', 'Request Failed');
      }
    });
  }

  onSubmitResetPassword(): void {
    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      this.toastr.error('Please correct the highlighted errors.', 'Validation Error');
      return;
    }
    
    if (this.resetPasswordForm.errors?.['passwordsNotMatching']) {
        this.toastr.error('New Password and Confirm Password must match.', 'Validation Error');
        return;
    }

    this.isLoading = true;
    const formValue = this.resetPasswordForm.value;

    const payload = {
      email: this.resetEmail,
      otp: formValue.otp,
      newPassword: formValue.newPassword,
    };

    this.authService.forgotPasswordReset(payload).pipe(
      catchError((err) => {
        const message = err.error?.message || 'Password reset failed. Check OTP and try again.';
        this.toastr.error(message, 'Reset Failed');
        this.isLoading = false;
        return [];
      })
    ).subscribe((response: ForgotPasswordResetResponse) => {
      this.isLoading = false;
      if (response.success) {
        this.toastr.success(response.message || 'Password reset successful! Redirecting to login...', 'Success');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      } else {
        this.toastr.error(response.message || 'Password reset failed.', 'Reset Failed');
      }
    });
  }
}