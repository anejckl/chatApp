import { Component, inject, OnInit } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { Message } from '../models/messages.models';
import { Model } from '../models/model.model';
import { ChatService } from '../services/chat.service';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  messages: Message[] = [];
  userInput: string = '';

  modelName: string = '';
  temperature: number = 0;

  private readonly debounceTimeMs = 300;

  private _chatService = inject(ChatService);

  ngOnInit() {
    this._chatService.getModelInfo().subscribe((response) => {
      this.modelName = response.modelName;
      this.temperature = response.temperature;
    });
    this._chatService.sendMessage().subscribe(
      (response) => {
        if (response.chatHistory) { this.messages = response.chatHistory; }
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
      .subscribe(
        (response) => {
          if (response.response) {
            this.messages.push({
              role: 'assistant',
              content: response.response,
            });
          }
          if (response.chatHistory) { this.messages = response.chatHistory; }
        });
  }
  public updateModelSettings(): void {
    const model: Model = {
      modelName: this.modelName,
      temperature: this.temperature,
    };
    this._chatService
      .updateModelSettings(model)
      .pipe(debounceTime(this.debounceTimeMs))
      .subscribe((response) => {
        console.log(response);
      });
  }
}
