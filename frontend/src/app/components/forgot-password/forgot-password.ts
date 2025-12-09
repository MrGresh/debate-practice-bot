import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services';
import { ApiResInterfaces } from '../../interfaces';
import { catchError, Subscription, timer } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';
import { passwordMatchValidator } from '../../utils';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword implements OnDestroy {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  step: 'send-otp' | 'reset-password' = 'send-otp';
  resetEmail: string = '';
  isLoading: boolean = false;

  isPasswordVisible: boolean = false;
  isConfirmPasswordVisible: boolean = false;

  private timerSubscription: Subscription | null = null;
  otpCountdownSeconds: number = 0;
  readonly RESEND_DELAY_SECONDS: number = 600;

  sendOtpForm: FormGroup;
  resetPasswordForm: FormGroup;

  constructor() {
    this.sendOtpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.resetPasswordForm = this.fb.group(
      {
        otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: passwordMatchValidator }
    );
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  get sendF() {
    return this.sendOtpForm.controls;
  }
  get resetF() {
    return this.resetPasswordForm.controls;
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.isPasswordVisible = !this.isPasswordVisible;
    } else {
      this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
    }
  }

  private startTimer(): void {
    this.stopTimer();
    this.otpCountdownSeconds = this.RESEND_DELAY_SECONDS;

    this.timerSubscription = timer(0, 1000).subscribe(() => {
      if (this.otpCountdownSeconds > 0) {
        this.otpCountdownSeconds--;
      } else {
        this.stopTimer();
      }
    });
  }

  private stopTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = null;
    }
  }

  get countdownDisplay(): string {
    const minutes = Math.floor(this.otpCountdownSeconds / 60);
    const seconds = this.otpCountdownSeconds % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
  }

  onSubmitSendOtp(): void {
    if (this.step === 'send-otp' && this.sendOtpForm.invalid) {
      this.sendOtpForm.markAllAsTouched();
      this.toastr.error('Please enter a valid email address.', 'Validation Error');
      return;
    }

    if (this.step === 'reset-password' && this.otpCountdownSeconds > 0) {
        return;
    }

    this.isLoading = true;
    
    const emailToUse = this.step === 'send-otp' ? this.sendF['email'].value : this.resetEmail;

    this.authService.forgotPasswordSendOtp({ email: emailToUse }).pipe(
      catchError((err) => {
        const message = err.error?.message || 'Failed to send OTP. Please check your email and try again.';
        this.toastr.error(message, 'Request Failed');
        this.isLoading = false;
        return [];
      })
    ).subscribe((response: ApiResInterfaces.ForgotPasswordSendOtpResponse) => {
      this.isLoading = false;
      if (response.success) {
        this.resetEmail = emailToUse;
        this.toastr.success(response.message || 'OTP sent successfully. Check your inbox.', 'Success');
        this.step = 'reset-password';
        this.startTimer();
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
      newPassword: formValue.password,
    };

    this.authService.forgotPasswordReset(payload).pipe(
      catchError((err) => {
        const message = err.error?.message || 'Password reset failed. Check OTP and try again.';
        this.toastr.error(message, 'Reset Failed');
        this.isLoading = false;
        return [];
      })
    ).subscribe((response: ApiResInterfaces.ForgotPasswordResetResponse) => {
      this.isLoading = false;
      if (response.success) {
        this.stopTimer();
        this.toastr.success(response.message || 'Password reset successful! Redirecting to login...', 'Success');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      } else {
        this.toastr.error(response.message || 'Password reset failed.', 'Reset Failed');
      }
    });
  }
}