import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { VAPI_CONSTANTS } from '../constants';
import { VapiInterfaces } from '../interfaces';
import { DashboardService } from './dashboard.service';
import Vapi from '@vapi-ai/web';

@Injectable({
  providedIn: 'root',
})
export class VapiService {
  private toastr = inject(ToastrService);
  private dashboardService = inject(DashboardService);
  private vapi: Vapi;

  private initialState: VapiInterfaces.CallState = {
    isActive: false,
    isConnecting: false,
    assistantId: null,
    errorMessage: null,
    callId: null,
  };

  private callStateSubject = new BehaviorSubject<VapiInterfaces.CallState>(this.initialState);
  callState$: Observable<VapiInterfaces.CallState> = this.callStateSubject.asObservable();

  constructor() {
    this.vapi = new Vapi(VAPI_CONSTANTS.PUBLIC_KEY);
    this.initializeVapi();
  }

  private initializeVapi(): void {
    if (!this.vapi) {
      this.toastr.error('Vapi SDK could not be initialized.', 'Initialization Error');
      return;
    }

    this.setupListeners();
    this.toastr.info('Vapi Service Initialized.', 'Ready');
  }

  private setupListeners(): void {
    this.vapi.on('call-start', () => {
      this.toastr.success(`Call started successfully`, 'Connected');
      this.updateState({
        isActive: true,
        isConnecting: false,
      });
    });

    this.vapi.on('call-end', () => {
      this.toastr.warning('Call ended.', 'Disconnected');
      this.updateState(this.initialState);
    });

    this.vapi.on('error', (event: any) => {
      console.error('Vapi Error:', event);
      this.toastr.error(`Call Error: ${event.message}`, 'Connection Failed');
      this.updateState({
        ...this.initialState,
        errorMessage: event.message,
      });
    });

    this.vapi.on('speech-start', () => {
      this.toastr.info('Speech detected.', 'Listening');
    });
  }

  async startCall(assistantId: string, token: string): Promise<void> {
    if (
      this.callStateSubject.getValue().isActive ||
      this.callStateSubject.getValue().isConnecting
    ) {
      this.toastr.info('A call is already in progress.', 'Wait');
      return;
    }

    this.toastr.info('Attempting to connect...', 'Calling');

    this.updateState({
      isActive: false,
      isConnecting: true,
      assistantId: assistantId,
      errorMessage: null,
      callId: null,
    });

    try {
      const res = await this.vapi.start(assistantId);
      if (res && res.id) {
        this.updateState({
          callId: res.id,
        });
        this.dashboardService.saveVapiCallId(token, res.id).subscribe({
          next: () => {
            this.toastr.success('Call ID successfully logged.', 'Server Acknowledged');
          },
          error: (e) => {
            console.error('Failed to save Vapi Call ID:', e);
            this.toastr.error('Failed to log call ID on server.', 'Server Error');
          },
        });
      }
    } catch (e) {
      console.error('Vapi.start failed:', e);
      this.toastr.error('Vapi Call Initiation failed. Check console.', 'Error');
      this.updateState(this.initialState);
    }
  }

  endCall(): void {
    const currentState = this.callStateSubject.getValue();

    if (currentState.isActive || currentState.isConnecting) {
      this.vapi.stop();
      this.toastr.info('Stopping call...', 'Ending');
    } else {
      this.toastr.warning('No active call to stop.', 'Info');
    }
  }

  private updateState(newState: Partial<VapiInterfaces.CallState>): void {
    const currentState = this.callStateSubject.getValue();
    this.callStateSubject.next({ ...currentState, ...newState });
  }
}
