import { Component, inject } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';
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

  private updateSubject$ = new Subject<Model>();

  ngOnInit() {
    this._chatService.getModelInfo().subscribe((response: Model) => {
      this.modelName = response.modelName;
      this.temperature = response.temperature;
    });

    this.updateSubject$
      .pipe(debounceTime(this.debounceTimeMs))
      .subscribe((model: Model) => {
        this._chatService.updateModelSettings(model).subscribe();
      });
  }

  public updateModelSettings(): void {
    const model: Model = {
      modelName: this.modelName,
      temperature: this.temperature,
    };
    this.updateSubject$.next(model);
  }
}
