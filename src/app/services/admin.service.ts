import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegistrationRequest, RegistrationResponse, User } from '../models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = 'http://localhost:3000/api/admin';
  private _httpService = inject(HttpClient);

  getUsers(): Observable<User[]> {
    return this._httpService.get<User[]>(`${this.apiUrl}/users`);
  }

  deleteUser(id: number) {
    return this._httpService.delete<string>(`${this.apiUrl}/users/${id}`);
  }

  register(data: RegistrationRequest): Observable<RegistrationResponse> {
    return this._httpService.post<RegistrationResponse>(
      `${this.apiUrl}/users`,
      data,
      {
        withCredentials: true,
      }
    );
  }
}
