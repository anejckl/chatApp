import { Component, inject } from '@angular/core';
import { debounceTime } from 'rxjs';
import { Model } from '../../models/model.model';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-settings-card',
  templateUrl: './settings-card.component.html',
  styleUrl: './settings-card.component.scss'
})
export class SettingsCardComponent {
  private _chatService = inject(ChatService);
  
  private readonly debounceTimeMs = 300;

  modelName: string = '';
  temperature: number = 0;

  ngOnInit() {
    this._chatService.getModelInfo().subscribe((response) => {
      this.modelName = response.modelName;
      this.temperature = response.temperature;
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
