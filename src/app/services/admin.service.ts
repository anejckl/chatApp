import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Key } from '../models/admin.model';
import { UniversalResponse } from '../models/universal-response.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = 'http://localhost:3000/api/admin';
  private _httpService = inject(HttpClient);

  getKeys(): Observable<Key[]> {
    return this._httpService.get<Key[]>(`${this.apiUrl}/keys`);
  }

  updateKeys(keyId: number, status: boolean): Observable<UniversalResponse> {
    return this._httpService.put<UniversalResponse>(`${this.apiUrl}/key/${keyId}`, { status });
  }
}