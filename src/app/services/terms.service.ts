import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  TermsResponse
} from '../models/terms.models';
import { UniversalResponse } from '../models/universal-response.model';

@Injectable({
  providedIn: 'root',
})
export class TermsService {
  private apiUrl = 'http://localhost:3000/api/terms';
  private _httpService = inject(HttpClient);

  public checkTerms(): Observable<TermsResponse> {
    return this._httpService.get<TermsResponse>(
      `${this.apiUrl}/check-terms`, { withCredentials: true });
  }

  public acceptTerms(): Observable<UniversalResponse> {
    return this._httpService.post<UniversalResponse>(
      `${this.apiUrl}/accept-terms`, {}, { withCredentials: true });
  }
}
