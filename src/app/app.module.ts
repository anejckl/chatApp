import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModule } from '@auth0/auth0-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import { SettingsCardComponent } from './chat/settings-card/settings-card.component';
import { SystemMessageCardComponent } from './chat/system-message-card/system-message-card.component';
import { TermsComponent } from './chat/welcome/terms/terms.component';
import { WelcomeComponent } from './chat/welcome/welcome.component';
import { ApiKeysComponent } from './dashboard/api-keys/api-keys.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HelpComponent } from './help/help.component';
import { HomeComponent } from './home/home.component';

import { MaskKeyPipe } from './mask-key.pipe';
import { MaterialModule } from './material/material.module';
import { PersonComponent } from './person/person.component';
import { SettingsComponent } from './settings/settings.component';
import { TranslocoRootModule } from './transloco-root.module';
import { environment } from './utility/environment';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ChatComponent,
    DashboardComponent,
    HelpComponent,
    SettingsComponent,
    SettingsCardComponent,
    SystemMessageCardComponent,
    PersonComponent,
    ApiKeysComponent,
    WelcomeComponent,
    TermsComponent,
    MaskKeyPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    TranslocoRootModule,
    FormsModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    AuthModule.forRoot({
      domain: environment.auth0.domain,
      clientId: environment.auth0.clientId,
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
