import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = 'http://localhost:3000/api/chat';
  private http =  inject(HttpClient);

  sendMessage(input: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { input }, { withCredentials: true });
  }
}
