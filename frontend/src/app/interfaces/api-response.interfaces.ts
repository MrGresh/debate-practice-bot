export interface BaseResponse<T = {}> {
  success: boolean;
  message: string;
  data?: T;
}

export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface RegisterResponseData {
  userId: string;
}

export interface LoginResponseData {
  user: User;
  token: string;
}

export interface ForgotPasswordSendOtpResponseData {
  email: string;
}

export interface ForgotPasswordResetResponseData {
  userId: string;
}

export interface ValidateTokenResponseData {
  user: User;
}

export interface VapiAssistantResponseData {
  id: string;
  orgId: string;
  name: string;
  voice: {
    voiceId: string;
    provider: string;
  };
  createdAt: string;
  updatedAt: string;
  model: {
    model: string;
    messages: {
      role: string;
      content: string;
    }[];
    provider: string;
  };
  firstMessage: string;
  voicemailMessage: string;
  endCallMessage: string;
  transcriber: {
    model: string;
    language: string;
    provider: string;
  };
  isServerUrlSecretSet: boolean;
}

export interface CallReport {
  coherence_score: number;
  overall_debate_score: number;
  argument_clarity_score: number;
  evidence_quality_score: number;
  emotional_tone_evaluation: string;
  pacing_evaluation: string;
  primary_strength: string;
  primary_weakness: string;
  fallacies: {
    list: string[];
    count: number;
  };
}

export interface TranscriptEntry {
  role: string;
  message: string;
  time: number;
  endTime: number;
}

export interface CallLog {
  callId: string;
  userId: string;
  recordingUrl: string;
  cost: number;
  durationMinutes: number;
  summary: string;
  transcript: TranscriptEntry[];
  call_report: CallReport;
  createdAt: string;
  startedAt: string;
  endedAt: string;
  status: string;
}

export interface FetchCallLogsResponseData {
  callLogs: CallLog[];
  pagination: {
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

export type GenericResponse = BaseResponse;
export type RegisterResponse = BaseResponse<RegisterResponseData>;
export type LoginResponse = BaseResponse<LoginResponseData>;
export type ValidateTokenResponse = BaseResponse<ValidateTokenResponseData>;
export type UserProfileResponse = BaseResponse<User>;
export type ForgotPasswordSendOtpResponse = BaseResponse<ForgotPasswordSendOtpResponseData>;
export type ForgotPasswordResetResponse = BaseResponse<ForgotPasswordResetResponseData>;
export type VapiAssistantsListResponse = BaseResponse<VapiAssistantResponseData[]>;
export type FetchCallLogsResponse = BaseResponse<FetchCallLogsResponseData>;
