import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, tap, switchMap } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  // credentials = { username: string, password: string }
  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post<any>(this.baseUrl, credentials);
  }  }