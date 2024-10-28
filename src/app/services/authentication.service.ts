import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginRequest, LoginResponse, User } from '../models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private _httpService = inject(HttpClient);

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this._httpService
      .post<LoginResponse>(`${this.apiUrl}/login`, credentials, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          if (response && response.user) {
            this.isAuthenticatedSubject.next(true);
            this.currentUserSubject.next(response.user);
          }
        })
      );
  }

  logout(): Observable<void> {
    return this._httpService
      .post<void>(`${this.apiUrl}/logout`, { withCredentials: true })
      .pipe(
        tap(() => {
          this.isAuthenticatedSubject.next(false);
          this.currentUserSubject.next(null);
        })
      );
  }
}
