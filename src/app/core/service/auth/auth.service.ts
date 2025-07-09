import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse } from '../../../shared/interface/auth.interface';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly tokenSubject = new BehaviorSubject<string | null>(null);
  private readonly token$ = this.tokenSubject.asObservable();

  login(): Observable<AuthResponse> {
    const body = new URLSearchParams();

    body.set('grant_type', 'password');
    body.set('client_id', 'app-cli');

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

   
    return this.http
      .post<AuthResponse>('/api/login', body.toString(), { headers })
      .pipe(
        tap((res) => {
          this.tokenSubject.next(res.access_token);
          localStorage.setItem('access_token', res.access_token);
        })
      );
  }

  isTokenValid(token: string) {
    if (!token) return false;

    try {
      const parts = token.split('.');
      if (parts.length !== 3) return false;

      const payload = JSON.parse(atob(parts[1]));
      const expiry = payload.exp * 1000;

      return expiry > Date.now();
    } catch (e) {
      return false;
    }
  }

  isAuthenticated(): boolean {
    const token = this.getTokenFromLocalStorage();
    return this.isTokenValid(token || '');
  }

  setToken(token: string) {
    this.tokenSubject.next(token);
  }

  getTokenFromLocalStorage() {
    return localStorage.getItem('access_token');
  }

  getToken() {
    return this.tokenSubject.getValue();
  }
}
