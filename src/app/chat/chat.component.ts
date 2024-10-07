import { Component, inject, OnInit } from '@angular/core';
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


  private _chatService = inject(ChatService);

  ngOnInit() {
    this._chatService.getChatHistory().subscribe((messages) => {
      this.messages = messages;
    });
  }
  
  public sendMessage(): void {
    if(this.userInput.trim() == '') { return; }

    const outgoingInput = this.userInput;
    this.userInput = '';

    this.messages.push({
      role: 'user',
      content: outgoingInput,
    });

    this._chatService.sendMessage(outgoingInput).subscribe((response) => {
          this.messages.push({
            role: 'assistant',
            content: response.response,
          });
      });
  }
}
