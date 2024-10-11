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
  public prompts: string[] = [];

  private _snackBarService = inject(SnackbarService);
  private _chatService = inject(ChatService);

  ngOnInit(): void {
    this._chatService.getChatHistory().subscribe((messages) => {
      this.prompts = messages
        .filter((message) => message.role === 'system')
        .map((message) => message.content);

      this.prompt.emit(this.prompts);
    });
  }

  public addPrompt() {
    if (this.prompts.length >= 2) {
      this._snackBarService.error('You can only add up to two prompts.');
      return;
    }

    this.prompts.push(this.systemMessageInput.trim());
    this.prompt.emit(this.prompts);
    this._snackBarService.success('Successfully added system prompt.');
    this.systemMessageInput = '';
  }

  public updatePrompt(index: number, newPrompt: string) {
    if (newPrompt.trim() === '') {
      this._snackBarService.error('Prompt cannot be empty.');
      return;
    }

    this.prompts[index] = newPrompt.trim();
    this.prompt.emit(this.prompts);
    this._snackBarService.success('Successfully updated system prompt.');
  }

  public removePrompt(index: number) {
    this.prompts.splice(index, 1);
    this.prompt.emit(this.prompts);
    this._snackBarService.info('Prompt removed.');
  }
}
