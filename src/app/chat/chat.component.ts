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
  public systemPrompts: string[] = [];


  private _chatService = inject(ChatService);

  ngOnInit() {
      this._chatService.getChatHistory().subscribe((messages) => {
        this.messages = messages.filter((message) => message.role !== 'system');
      });
  }

  public onPromptsChange(prompts: string[]): void {
    this.systemPrompts = prompts;
  }
  
  public sendMessage(): void {
    if(this.userInput.trim() == '') { return; }
    const systemMessage = this.systemPrompts.join();

    const outgoingInput: Message = {
      role: 'user',
      content: this.userInput,
      system: systemMessage,
    }
  
    this.messages.push({
      role: 'user',
      content: this.userInput,
    });
    this.userInput = '';
    this._chatService.sendMessage(outgoingInput).subscribe((response) => {
          this.messages.push({
            role: 'assistant',
            content: response.content,
          });
      });
  }
}
