import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Key, Log } from '../models/admin.model';
import { RegistrationRequest, RegistrationResponse, UniversalResponse, User } from '../models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = 'http://localhost:3000/api/admin';
  private _httpService = inject(HttpClient);

  getUsers(): Observable<User[]> {
    return this._httpService.get<User[]>(`${this.apiUrl}/users`);
  }

  getUser(id: number): Observable<User> {
    return this._httpService.get<User>(`${this.apiUrl}/users/${id}`);
  }

  updateUser(userId: number, updatedData: Partial<User>): Observable<UniversalResponse> {
    return this._httpService.put<UniversalResponse>(`${this.apiUrl}/users/${userId}`, updatedData);
  }

  resetPassword(userId: number): Observable<UniversalResponse> {
    return this._httpService.post<UniversalResponse>(`${this.apiUrl}/reset-password/${userId}`, {});
  }

  deleteUser(id: number) {
    return this._httpService.delete<string>(`${this.apiUrl}/users/${id}`);
  }

  registerUser(data: RegistrationRequest): Observable<RegistrationResponse> {
    return this._httpService.post<RegistrationResponse>(
      `${this.apiUrl}/users`, data, { withCredentials: true });
  }

  getKeys(): Observable<Key[]> {
    return this._httpService.get<Key[]>(`${this.apiUrl}/keys`);
  }

  updateKeys(keyId: number, status: boolean): Observable<UniversalResponse> {
    return this._httpService.put<UniversalResponse>(`${this.apiUrl}/key/${keyId}`, { status });
  }

  getUserLogs(userId: number): Observable<Log[]> {
    return this._httpService.get<Log[]>(`${this.apiUrl}/${userId}/logs`);
  }
}
