import { isDevMode, NgModule } from '@angular/core';
import {
  getBrowserLang,
  provideTransloco,
  TranslocoModule,
} from '@jsverse/transloco';
import { TranslocoHttpLoader } from './transloco-loader';

@NgModule({
  exports: [TranslocoModule],
  providers: [
    provideTransloco({
      config: {
        availableLangs: ['en', 'slo'],
        defaultLang: getBrowserLang(),
        //This has to be set to true otherwise it doesnt render the lang changes
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
  ],
})
export class TranslocoRootModule {}
