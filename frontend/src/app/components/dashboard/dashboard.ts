import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  logout(): void {
    const token = this.authService.getToken();

    if (token) {
      this.authService.logout(token).subscribe({
        next: (response) => {
          this.toastr.success(response.message || 'Logged out successfully.', 'Success');
        },
        error: (err) => {
          console.error('Logout API error:', err);
          const message = err.error?.message || 'Server error during logout, clearing local session.';
          this.toastr.error(message, 'Logout Failed');
        },
        complete: () => {
          this.authService.removeToken();
          this.router.navigate(['/login']);
        }
      });
    } else {
       this.toastr.info('You were already logged out.', 'Session Cleared');
       this.authService.removeToken();
       this.router.navigate(['/login']);
    }
  }
}