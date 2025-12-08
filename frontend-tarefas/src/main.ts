// filepath: c:\Users\24153584\Desktop\TCC\Angular\front-end\src\main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import 'zone.js';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [BrowserModule, FormsModule],
  // ...
})
export class AppModule {}


bootstrapApplication(App, {
  providers: [
    provideHttpClient(),
    provideRouter(routes)
  ],
});