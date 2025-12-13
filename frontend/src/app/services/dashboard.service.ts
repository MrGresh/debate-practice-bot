import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONSTANTS } from '../constants';
import { ApiReqInterfaces, ApiResInterfaces } from '../interfaces';
import { getAuthHeaders } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  getProfile(token: string): Observable<ApiResInterfaces.UserProfileResponse> {
    return this.http.get<ApiResInterfaces.UserProfileResponse>(
      API_CONSTANTS.GET_USER,
      { headers: getAuthHeaders(token) }
    );
  }

  getVapiAssistants(token: string): Observable<ApiResInterfaces.VapiAssistantsListResponse> {
    return this.http.get<ApiResInterfaces.VapiAssistantsListResponse>(
      API_CONSTANTS.VAPI_ASSISTANTS,
      { headers: getAuthHeaders(token) }
    );
  }

  saveVapiCallId(token: string, callId: string): Observable<ApiResInterfaces.GenericResponse> {
    return this.http.post<ApiResInterfaces.GenericResponse>(
      API_CONSTANTS.VAPI_SAVE_CALL_ID,
      { callId },
      { headers: getAuthHeaders(token) }
    );
  }

  setCallUnderEvaluation(token: string, callId: string): Observable<ApiResInterfaces.GenericResponse> {
    return this.http.post<ApiResInterfaces.GenericResponse>(
      API_CONSTANTS.VAPI_SET_CALL_UNDER_EVALUATION,
      { callId },
      { headers: getAuthHeaders(token) }
    );
  }

  fetchCallLogs(token: string, pageNumber: number, pageSize: number): Observable<ApiResInterfaces.FetchCallLogsResponse> {
    return this.http.post<ApiResInterfaces.FetchCallLogsResponse>(
      API_CONSTANTS.VAPI_FETCH_CALL_LOGS,
      { pageNumber, pageSize },
      { headers: getAuthHeaders(token) }
    );
  }
}