import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Model } from '../models/model.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = 'http://localhost:3000/api';
  
  private http = inject(HttpClient);

  getModelInfo(): Observable<Model> {
    return this.http.get<Model>(`${this.apiUrl}/model`);
  }

  updateModelSettings(model: Model): Observable<Model> {
    return this.http.post<Model>(`${this.apiUrl}/model/settings`, model);
  }

  sendMessage(input: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/chat`, { input }, { withCredentials: true });
  }
}
