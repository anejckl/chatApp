import { isDevMode, NgModule } from '@angular/core';
import {
  provideTransloco,
  TranslocoModule
} from '@jsverse/transloco';
import { TranslocoHttpLoader } from './transloco-loader';


@NgModule({
  exports: [ TranslocoModule ],
  providers: [
      provideTransloco({
        config: {
          availableLangs: ['en', 'slo'],
          defaultLang: 'slo',
          // Remove this option if your application doesn't support changing language in runtime.
          prodMode: !isDevMode(),
        },
        loader: TranslocoHttpLoader
      }),
  ],
})
export class TranslocoRootModule {}
