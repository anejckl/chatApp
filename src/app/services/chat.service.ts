import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = 'https://api.openai.com/v1/chat/completions';
  private apiKey = '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'

  constructor(private http: HttpClient) {}

  sendMessage(userInput: string) {
    const headers = {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };

    const body = {
      model: 'gpt-4',
      messages: [
        { role: 'user', content: userInput }
      ],
      max_tokens: 150,
    };

    return this.http.post(this.apiUrl, body, { headers });
  }
}
