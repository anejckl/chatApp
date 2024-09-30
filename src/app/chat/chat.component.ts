import { Component, inject } from '@angular/core';
import { Messages } from '../models/messages.models';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  messages: Messages[] = [{
    content: 'Ask me a question?',
    isSender: false
  }];
  userInput: string = '';

  public _chatService = inject(ChatService);

  public sendMessage(): void {
    this.messages.push({
      content: this.userInput,
      isSender: true,
    });
    this.userInput = '';
    this._chatService.sendMessage(this.userInput).subscribe((response: any) => {
      const assistantMessage = response.choices[0].message.content;
      this.messages.push({
        content: assistantMessage,
        isSender: false,
      });
    });
  }
}