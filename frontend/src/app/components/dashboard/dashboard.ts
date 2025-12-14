import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { AuthService, DashboardService, VapiService } from '../../services';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ApiResInterfaces, VapiInterfaces } from '../../interfaces';
import { CallLogDetailsDialogComponent } from '../call-log-details-dialog/call-log-details-dialog';
import { catchError, Subscription } from 'rxjs';
import { getToken, removeToken } from '../../utils';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CallLogDetailsDialogComponent], 
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})

export class Dashboard {
  private authService = inject(AuthService);
  private dashboardService = inject(DashboardService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private vapiService = inject(VapiService);

  userProfile: ApiResInterfaces.User | null = null;
  vapiAssistants: ApiResInterfaces.VapiAssistantResponseData[] = [];
  
  isLoading: boolean = false;
  isAssistantsLoading: boolean = false;
  
  activeTab: 'assistants' | 'callHistory' = 'assistants';

  callState: VapiInterfaces.CallState | null = null;
  private callStateSubscription: Subscription = new Subscription();
  
  get isCallDialogOpen(): boolean {
    return this.callState ? (this.callState.isActive || this.callState.isConnecting) : false;
  }

  callLogsResponse: ApiResInterfaces.FetchCallLogsResponseData = { callLogs: [], pagination: { pageNumber: 1, pageSize: 10, totalCount: 0, totalPages: 0 } };
  isCallLogsLoading: boolean = false;

  isDetailsDialogOpen: boolean = false;
  selectedCallLog: ApiResInterfaces.CallLog | null = null;

  ngOnInit(): void {
    this.loadUserProfile();
    if (this.activeTab === 'assistants') {
      this.loadVapiAssistants();
    }
    this.loadCallLogs();
    this.subscribeToCallState();
  }
  
  ngOnDestroy(): void {
    this.callStateSubscription.unsubscribe();
  }

  loadCallLogs(pageNumber: number = 1, pageSize: number = 10): void {
    const token = getToken();

    if (!token) {
      this.toastr.warning('Authentication token missing. Please log in.', 'Session Expired');
      this.router.navigate(['/login']);
      return;
    }
    
    this.isCallLogsLoading = true;

    this.dashboardService.fetchCallLogs(token, pageNumber, pageSize).pipe(
      catchError((err) => {
        const message = err.error?.message || 'Failed to fetch call logs.';
        this.toastr.error(message, 'Call History Error');
        this.isCallLogsLoading = false;
        return [];
      })
    ).subscribe((response: ApiResInterfaces.FetchCallLogsResponse) => {
      this.isCallLogsLoading = false;
      if (response.success && response.data) {
        this.callLogsResponse = response.data;
        console.log('Fetched Call Logs Response:', this.callLogsResponse);
        this.toastr.info(`Loaded ${response.data.callLogs.length} call logs. Total: ${response.data.pagination.totalCount}`, 'Call History Ready');
      } else {
        const message = response.message || 'Failed to fetch call logs.';
        this.toastr.error(message, 'Call History Error');
      }
    });
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
    const token = getToken();

    if (!token) {
      this.toastr.warning('Authentication token missing. Please log in.', 'Session Expired');
      this.router.navigate(['/login']);
      return;
    }
    this.vapiService.endCall(token);
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

  openCallDetails(log: ApiResInterfaces.CallLog): void {
    this.selectedCallLog = log;
    this.isDetailsDialogOpen = true;
  }

  closeCallDetails(): void {
    this.isDetailsDialogOpen = false;
    this.selectedCallLog = null;
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