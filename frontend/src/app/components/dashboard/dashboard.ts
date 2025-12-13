import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { AuthService, DashboardService, VapiService } from '../../services';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ApiResInterfaces, VapiInterfaces } from '../../interfaces';
import { catchError, Subscription } from 'rxjs';
import { getToken, removeToken } from '../../utils';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})

export class Dashboard implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private dashboardService = inject(DashboardService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private vapiService = inject(VapiService);

  userProfile: ApiResInterfaces.User | null = null;
  vapiAssistants: ApiResInterfaces.VapiAssistant[] = [];
  
  isLoading: boolean = false;
  isAssistantsLoading: boolean = false;
  
  activeTab: 'assistants' | 'callHistory' = 'assistants';

  // NEW VAPI PROPERTIES
  callState: VapiInterfaces.CallState | null = null;
  private callStateSubscription: Subscription = new Subscription();
  
  get isCallDialogOpen(): boolean {
    return this.callState ? (this.callState.isActive || this.callState.isConnecting) : false;
  }
  // END NEW VAPI PROPERTIES

  ngOnInit(): void {
    this.loadUserProfile();
    if (this.activeTab === 'assistants') {
      this.loadVapiAssistants();
    }
    this.subscribeToCallState();
  }
  
  ngOnDestroy(): void {
    this.callStateSubscription.unsubscribe();
  }

  subscribeToCallState(): void {
    this.callStateSubscription = this.vapiService.callState$.subscribe(state => {
      this.callState = state;
    });
  }
  
  startVapiCall(assistantId: string): void {
    const token = getToken();

    if (!token) {
      this.toastr.warning('Authentication token missing. Please log in.', 'Session Expired');
      this.router.navigate(['/login']);
      return;
    }
    this.vapiService.startCall(assistantId, token);
  }
  
  endVapiCall(): void {
    this.vapiService.endCall();
  }

  loadUserProfile(): void {
    const token = getToken();

    if (!token) {
      this.toastr.warning('Authentication token missing. Please log in.', 'Session Expired');
      this.router.navigate(['/login']);
      return;
    }

    this.isLoading = true;
    this.dashboardService.getProfile(token).pipe(
      catchError((err) => {
        const message = err.error?.message || 'Failed to fetch user profile. Redirecting to login.';
        this.toastr.error(message, 'API Error');
        this.isLoading = false;
        removeToken(); 
        this.router.navigate(['/login']);
        return [];
      })
    ).subscribe((response: ApiResInterfaces.UserProfileResponse) => {
      this.isLoading = false;
      if (response.success && response.data) {
        this.userProfile = response.data; 
        this.toastr.success('User profile loaded successfully.', 'Welcome!');
      } else {
        const message = response.message || 'Failed to fetch user profile.';
        this.toastr.error(message, 'Load Error');
        removeToken();
        this.router.navigate(['/login']);
      }
    });
  }

  loadVapiAssistants(): void {
    if (this.vapiAssistants.length > 0 && !this.isAssistantsLoading) {
      return; 
    }

    const token = getToken();

    if (!token) {
      this.toastr.warning('Authentication token missing. Please log in.', 'Session Expired');
      this.router.navigate(['/login']);
      return;
    }

    this.isAssistantsLoading = true;
    this.dashboardService.getVapiAssistants(token).pipe(
      catchError((err) => {
        const message = err.error?.message || 'Failed to fetch Vapi assistants.';
        this.toastr.error(message, 'Assistant Load Error');
        this.isAssistantsLoading = false;
        return [];
      })
    ).subscribe((response: ApiResInterfaces.VapiAssistantsListResponse) => {
      this.isAssistantsLoading = false;
      if (response.success && response.data) {
        this.vapiAssistants = response.data;
        this.toastr.info(`Loaded ${this.vapiAssistants.length} Vapi assistants.`, 'Assistants Ready');
      } else {
        const message = response.message || 'Failed to fetch Vapi assistants.';
        this.toastr.error(message, 'Assistant Load Error');
      }
    });
  }

  setActiveTab(tab: 'assistants' | 'callHistory'): void {
    this.activeTab = tab;
    
    if (tab === 'assistants' && this.vapiAssistants.length === 0) {
      this.loadVapiAssistants();
    }
  }

  logout(): void {
    const token = getToken();

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
          removeToken();
          this.router.navigate(['/login']);
        }
      });
    } else {
       this.toastr.info('You were already logged out.', 'Session Cleared');
       removeToken();
       this.router.navigate(['/login']);
    }
  }
}