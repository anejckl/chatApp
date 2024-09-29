import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HelpComponent } from './help/help.component';
import { HomeComponent } from './home/home.component';
import { MaterialModule } from './material/material.module';
import { TranslocoRootModule } from './transloco-root.module';

@NgModule({
  declarations: [AppComponent, HomeComponent, ChatComponent, DashboardComponent, HelpComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    TranslocoRootModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}