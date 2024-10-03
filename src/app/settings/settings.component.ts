import { Component, inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  private _themeService = inject(ThemeService);
  private _translocoService = inject(TranslocoService);

  public languages = ['slo', 'en'];
  public browserLang = this._translocoService.getActiveLang();

  public isDarkMode = this._themeService.isDarkMode();


  public toggleTheme(): void {
    this._themeService.toggleTheme();
  }

  public toggleLanguage(lang: string) {
    this._translocoService.setActiveLang(lang);
  }
}
