import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../models/messages.models';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = 'http://localhost:3000/api/chat';
  private http =  inject(HttpClient);

  sendMessage(messages: Message[]): Observable<any> {
    return this.http.post<any>(this.apiUrl, { messages });
  }
}
