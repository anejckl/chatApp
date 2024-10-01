import { Component, inject } from '@angular/core';
import { Message } from '../models/messages.models';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  messages: Message[] = [];
  userInput: string = '';

  public _chatService = inject(ChatService);

  public sendMessage(): void {
    this.messages.push({
      role: 'user',
      content: this.userInput,
    });
    
    this.userInput = '';
    const messagesToSend = [...this.messages];

    this._chatService.sendMessage(messagesToSend).subscribe(
      (response) => {
        this.messages.push({
          role: 'assistant',
          content: response.choices[0].message.content,
        });
      },
    );
  }
}