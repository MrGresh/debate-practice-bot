export interface CallState {
  isActive: boolean;
  isConnecting: boolean;
  assistantId: string | null;
  errorMessage: string | null;
  callId: string | null;
}