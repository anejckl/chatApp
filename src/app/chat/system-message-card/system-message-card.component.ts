import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-system-message-card',
  templateUrl: './system-message-card.component.html',
  styleUrl: './system-message-card.component.scss'
})
export class SystemMessageCardComponent {
  @Input() systemMessage: string = '';
  @Output() systemMessageChange: EventEmitter<string> = new EventEmitter<string>();

  private _snackBarService = inject(SnackbarService);
  

  public emitSystemMessage(message: string) {
    this._snackBarService.openSnackBar('Successfully added system prompt');
    this.systemMessageChange.emit(message);
  }
}
