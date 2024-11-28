import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService, User } from '@auth0/auth0-angular';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/user';
  private _httpService = inject(HttpClient);
  private _authService = inject(AuthService);
  
  sendUserDetails(): void {
    this._authService.user$.subscribe((user: User | null | undefined) => {
      if (user) {
        this._httpService.post(this.apiUrl, user, { withCredentials: true }).subscribe();
      }
    });
  }

  logout(): void {
    this._httpService.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).subscribe();
  }
}