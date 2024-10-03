import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
export interface Message {
  role: string;
  content: string;
}
export interface Model {
  modelName: string;
  temperature: number;
}
@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = 'http://localhost:3000/api';
  constructor(private http: HttpClient) {}
  getModelInfo(): Observable<Model> {
    return this.http.get<Model>(`${this.apiUrl}/model`, {
      withCredentials: true,
    });
  }
  updateModelSettings(model: Model): Observable<Model> {
    return this.http.post<Model>(`${this.apiUrl}/model/settings`, model, {
      withCredentials: true,
    });
  }
  sendMessage(input?: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/chat`,
      { input },
      { withCredentials: true }
    );
  }
}
