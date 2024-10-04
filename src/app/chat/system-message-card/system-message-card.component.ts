import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-system-message-card',
  templateUrl: './system-message-card.component.html',
  styleUrl: './system-message-card.component.scss'
})
export class SystemMessageCardComponent {
  @Input() systemMessage: string = '';
  @Output() systemMessageChange: EventEmitter<string> = new EventEmitter<string>();
  

  public emitSystemMessage(message: string) {
    console.log(message);
    this.systemMessageChange.emit(message);
  }
}
