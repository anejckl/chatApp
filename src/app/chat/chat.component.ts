import { Component, inject, OnInit } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { Message } from '../models/messages.models';
import { ChatService } from '../services/chat.service';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  messages: Message[] = [];
  userInput: string = '';
  systemMessage: string = '';

  private readonly debounceTimeMs = 300;

  private _chatService = inject(ChatService);

  ngOnInit() {
    this._chatService.sendMessage().subscribe((response) => {
      if (response.chatHistory) {
        this.messages = response.chatHistory;
      }
    });
  }
  public sendMessage(): void {
    const outgoingInput = this.userInput;
    this.messages.push({
      role: 'user',
      content: this.userInput,
    });
    this.userInput = '';
    

    this._chatService
      .sendMessage(outgoingInput)
      .pipe(debounceTime(this.debounceTimeMs))
      .subscribe((response) => {
        if (response.response) {
          this.messages.push({
            role: 'assistant',
            content: response.response,
          });
        }
        if (response.chatHistory) {
          this.messages = response.chatHistory;
        }
      });
  }
}
