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
}