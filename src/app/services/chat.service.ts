import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../models/messages.models';
import { Model } from '../models/model.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = 'http://localhost:3000/api';
  private _httpService = inject(HttpClient);

  getModelInfo(): Observable<Model> {
    return this._httpService.get<Model>(`${this.apiUrl}/model`, {
      withCredentials: true,
    });
  }

  getChatHistory(): Observable<Message[]> {
    return this._httpService.get<Message[]>(`${this.apiUrl}/chat/history`, {
      withCredentials: true,
    });
  }

  updateModelSettings(model: Model): Observable<Model> {
    return this._httpService.post<Model>(
      `${this.apiUrl}/model/settings`,
      model,
      {
        withCredentials: true,
      }
    );
  }

  sendMessage(input: Message, system?: string): Observable<Message> {
    return this._httpService.post<Message>(
      `${this.apiUrl}/chat`,
      input,
      { withCredentials: true }
    );
  }
}
