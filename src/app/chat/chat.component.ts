import { Component, inject, Input, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { Message } from '../models/messages.models';
import { ChatService } from '../services/chat.service';
import { SnackbarService } from '../services/snackbar.service';
import { toMessage } from '../utility/message-convert';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit {
  messages: Message[] = [];
  userInput: string = '';
  public systemPrompts: string[] = [];
  isTyping: boolean = false; // Add this line

  @Input() isCollapsed!: boolean;

  private _chatService = inject(ChatService);
  private _snackBarService = inject(SnackbarService);

  private sessionExpirationTimer: Subscription | null = null;

  ngOnInit() {
    this._chatService.getChatHistory().subscribe((messages) => {
      this.messages = messages.filter((message) => message.role !== 'system');
    });
  }

  ngOnDestroy() {
    if (this.sessionExpirationTimer) {
      this.sessionExpirationTimer.unsubscribe();
    }
  }

  public onPromptsChange(prompts: string[]): void {
    this.systemPrompts = prompts;
  }

  public sendMessage(): void {
    if (this.userInput.trim() === '') {
      return;
    }

    const outgoingInput = toMessage('user', this.userInput);

    // Add the user's message to the messages array
    this.messages.push({
      role: 'user',
      content: this.userInput,
    });

    // Clear the user input field
    this.userInput = '';

    // Show the typing indicator
    this.isTyping = true;

    // Send the message to the chat service
    this._chatService.sendMessage(outgoingInput).subscribe((response) => {
      // Hide the typing indicator
      this.isTyping = false;

      // Add the assistant's response to the messages array
      this.messages.push({
        role: 'assistant',
        content: response.content,
      });

      if (response.sessionExpire) {
        this.startSessionTimer(response.sessionExpire);
      }
    });
  }

  private startSessionTimer(sessionExpire: number): void {
    if (this.sessionExpirationTimer) {
      this.sessionExpirationTimer.unsubscribe();
    }

    this.sessionExpirationTimer = timer(sessionExpire).subscribe(() => {
      this._snackBarService.error('Your session has expired', 'Refresh').onAction().subscribe(() => {
        location.reload();
      });
    });
  }
}
