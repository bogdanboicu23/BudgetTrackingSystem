import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
  };
}

export interface RegisterResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  
  private readonly apiUrl = `${environment.apiUrl}/user`;
  private readonly tokenKey = 'auth_token';
  
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const token = this.getToken();
      if (token) {
        const user = this.decodeToken(token);
        this.currentUserSubject.next(user);
      }
    }
  }

  login(credentials: LoginDto): Observable<LoginResponse> {
    console.log('Attempting login to:', `${this.apiUrl}/login`);
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          console.log('Login successful:', response);
          if (response && response.token) {
            this.setToken(response.token);
            this.currentUserSubject.next(response.user);
            console.log('Token saved, checking authentication:', this.isAuthenticated());
          } else {
            console.error('No token in response:', response);
          }
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Login error:', error);
          return throwError(() => error);
        })
      );
  }

  register(credentials: RegisterDto): Observable<RegisterResponse> {
    console.log('Attempting registration to:', `${this.apiUrl}/register`);
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, credentials, {
      headers: { 'Content-Type': 'application/json' }
    })
      .pipe(
        tap(response => {
          console.log('Registration service response:', response);
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Registration error:', error);
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    console.log('Checking authentication, token:', token ? 'exists' : 'missing');
    
    if (!token) return false;
    
    try {
      const payload = this.decodeToken(token);
      console.log('Token payload:', payload);
      
      // Check if exp exists and handle it properly
      if (payload && payload.exp) {
        // JWT exp is in seconds, JavaScript Date is in milliseconds
        const expDate = new Date(payload.exp * 1000);
        const now = new Date();
        const isValid = expDate > now;
        console.log('Token expiration:', expDate, 'Now:', now, 'Valid:', isValid);
        return isValid;
      }
      
      // If no exp claim, just check if token exists
      return true;
    } catch (error) {
      console.error('Token decode error:', error);
      return false;
    }
  }

  private setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      console.log('Setting token in localStorage');
      localStorage.setItem(this.tokenKey, token);
      // Verify it was saved
      const savedToken = localStorage.getItem(this.tokenKey);
      console.log('Token saved successfully:', savedToken ? 'yes' : 'no');
    } else {
      console.log('Not in browser, cannot save token');
    }
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      console.log('Decoded token:', decoded);
      return decoded;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}