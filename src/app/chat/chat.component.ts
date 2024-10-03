import { Component, inject, OnInit } from '@angular/core';
import { debounceTime } from 'rxjs';
import { Message } from '../models/messages.models';
import { Model } from '../models/model.model';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  messages: Message[] = [];
  userInput: string = '';

  modelName: string = '';
  temperature: number = 0;

  private readonly debounceTimeMs = 300;

  public _chatService = inject(ChatService);

  ngOnInit() {
    this._chatService.getModelInfo().subscribe(
      response => {
        this.modelName = response.modelName;
        this.temperature = response.temperature;
          console.log('Model Name:', this.modelName);
        console.log('Temperature:', this.temperature);
      });
    console.log(this.modelName);
  }

  public sendMessage(): void {
    this.messages.push({
      role: 'user',
      content: this.userInput,
    });
    
    const outGoingInput = this.userInput;
    this.userInput = '';
    this._chatService.sendMessage(outGoingInput)
    .pipe(debounceTime(this.debounceTimeMs))
    .subscribe((message) => {
        this.messages.push({
          role: 'assistant',
          content: message.response
        });
      },
    );
  }

  public updateModelSettings(): void {
    const model: Model = {
      modelName: this.modelName,
      temperature: this.temperature,
    }
    this._chatService.updateModelSettings(model)
    .pipe(debounceTime(this.debounceTimeMs))
    .subscribe(response => {
      console.log(response); // TODO: Add snackbar here.
    });
  }
}