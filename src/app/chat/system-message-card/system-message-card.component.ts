import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-system-message-card',
  templateUrl: './system-message-card.component.html',
  styleUrl: './system-message-card.component.scss',
})
export class SystemMessageCardComponent implements OnInit {
  @Output() prompt = new EventEmitter<string[]>();

  public systemMessageInput: string = '';

  private _snackBarService = inject(SnackbarService);
  private _chatService = inject(ChatService);

  public prompts: string[] = [];

  ngOnInit(): void {
    this.loadPrompts();
  }

  private loadPrompts() {
    this._chatService.getChatHistory().subscribe((messages) => {
      this.prompts = messages
        .filter((message) => message.role === 'system')
        .map((message) => message.content);
      this.prompt.emit(this.prompts);
    });
  }

  public addPrompt() {
    if (this.prompts.length >= 1) {
      this._snackBarService.error('You can only add one prompt.');
      return;
    }

    this._chatService.updateSystemPrompt(this.systemMessageInput.trim(), 'add')
      .subscribe(response => {
        if (response.success) {
          this.systemMessageInput = '';
          this._snackBarService.success('Prompt added successfully.');
          this.loadPrompts();
        }
      });
  }

  public updatePrompt(newPrompt: string, oldPrompt: string) {
    this._chatService.updateSystemPrompt(newPrompt, 'update', oldPrompt)
      .subscribe(response => {
        if (response.success) {
          this._snackBarService.success('Successfully updated system prompt.');
          this.loadPrompts();
        }
      });
  }

  public removePrompt(index: number) {
    this._chatService.updateSystemPrompt(this.prompts[index], 'remove')
      .subscribe(response => {
        if (response.success) {
          this._snackBarService.info('Prompt removed successfully.');
          this.loadPrompts();
        }
      });
  }
}
