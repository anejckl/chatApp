import { Component, inject, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { translate } from '@jsverse/transloco';
import { Subscription, timer } from 'rxjs';
import { Message } from '../models/messages.models';
import { AuthenticationService } from '../services/authentication.service';
import { ChatService } from '../services/chat.service';
import { SnackbarService } from '../services/snackbar.service';
import { toMessage } from '../utility/message-convert';
import { WelcomeComponent } from './welcome/welcome.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit {
  messages: Message[] = [];
  systemPrompts: string[] = [];

  userInput: string = '';
  isTyping: boolean = false;

  @Input() isCollapsed!: boolean;

  private _chatService = inject(ChatService);
  private _snackBarService = inject(SnackbarService);
  private _authService = inject(AuthenticationService);

  private sessionExpirationTimer: Subscription | null = null;

  private dialog = inject(MatDialog);

  ngOnInit() {
    this._chatService.getChatHistory().subscribe((messages) => {
      this.messages = messages.filter((message) => message.role !== 'system');
    });
    this.checkTerms();
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
    const outgoingInput = toMessage('user', this.userInput);

    this.messages.push({
      role: 'user',
      content: this.userInput,
    });

    this.userInput = '';
    this.isTyping = true;

    this._chatService.sendMessage(outgoingInput).subscribe((response) => {
      this.isTyping = false;

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
      this._snackBarService
        .error(translate('CHAT.SESSION-EXPIRED'), translate('CHAT.REFRESH'))
        .onAction()
        .subscribe(() => {
          location.reload();
        });
    });
  }

  private checkTerms(): void {
    this._authService.checkTerms().subscribe((response) => {
      if (!response.acceptedTerms) {
        this.openTerms();
      }
    });
  }

  private openTerms(): void {
    const dialogRef = this.dialog.open(WelcomeComponent, {
      width: '400px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((accepted) => {
      if (accepted) {
        this._authService.acceptTerms().subscribe();
      }
    });
  }
}
