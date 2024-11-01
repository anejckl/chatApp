import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import { SettingsCardComponent } from './chat/settings-card/settings-card.component';
import { SystemMessageCardComponent } from './chat/system-message-card/system-message-card.component';
import { ApiKeysComponent } from './dashboard/api-keys/api-keys.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditUserComponent } from './dashboard/user-management/edit-user/edit-user.component';
import { UserManagementComponent } from './dashboard/user-management/user-management.component';
import { HelpComponent } from './help/help.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PersonComponent } from './login/person/person.component';
import { RegistrationComponent } from './login/registration/registration.component';
import { MaterialModule } from './material/material.module';
import { SettingsComponent } from './settings/settings.component';
import { TranslocoRootModule } from './transloco-root.module';

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
    LoginComponent,
    RegistrationComponent,
    PersonComponent,
    UserManagementComponent,
    ApiKeysComponent,
    EditUserComponent,
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
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
