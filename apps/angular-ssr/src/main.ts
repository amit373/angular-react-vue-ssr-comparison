import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideClientHydration } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { mergeApplicationConfig } from '@angular/core';

const clientConfig = mergeApplicationConfig(appConfig, {
  providers: [
    provideAnimations(),
    provideClientHydration(),
  ],
});

bootstrapApplication(AppComponent, clientConfig).catch((err) => console.error(err));

