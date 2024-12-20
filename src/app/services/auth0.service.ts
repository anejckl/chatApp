import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from '../models/admin.model';
import { environment } from '../utility/environment';

@Injectable({
  providedIn: 'root',
})
export class Auth0Service {
  private readonly apiUrl = `https://${environment.auth0.domain}/api/v2`;
  private readonly headers = new HttpHeaders({
    Authorization: `Bearer ${environment.auth0.token}`,
    Accept: 'application/json',
  });

  private _httpService = inject(HttpClient);

  getUserRoles(userId: string): Observable<Role[]> {
    const url = `${this.apiUrl}/users/${userId}/roles`;
    return this._httpService.get<Role[]>(url, { headers: this.headers });
  }
}