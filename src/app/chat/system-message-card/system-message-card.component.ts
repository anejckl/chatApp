import { Component, EventEmitter, inject, Output } from '@angular/core';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-system-message-card',
  templateUrl: './system-message-card.component.html',
  styleUrl: './system-message-card.component.scss',
})
export class SystemMessageCardComponent {
  @Output() prompt = new EventEmitter<string[]>();

  public systemMessageInput: string = '';
  public prompts: string[] = [];

  private _snackBarService = inject(SnackbarService);

  public addPrompt() {
    if (this.prompts.length >= 2) {
      this._snackBarService.openSnackBar('You can only add up to two prompts.');
      return;
    }

    this.prompts.push(this.systemMessageInput.trim());
    this.prompt.emit(this.prompts);
    this._snackBarService.openSnackBar('Successfully added system prompt.');
    this.systemMessageInput = '';
  }

  public updatePrompt(index: number, newPrompt: string) {
    if (newPrompt.trim() === '') {
      this._snackBarService.openSnackBar('Prompt cannot be empty.');
      return;
    }

    this.prompts[index] = newPrompt.trim();
    this.prompt.emit(this.prompts);
    this._snackBarService.openSnackBar('Successfully updated system prompt.');
  }

  public removePrompt(index: number) {
    this.prompts.splice(index, 1);
    this.prompt.emit(this.prompts);
    this._snackBarService.openSnackBar('Prompt removed.');
  }
}
