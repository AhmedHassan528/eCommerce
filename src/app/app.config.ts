import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { headerInterceptor } from './core/Interceptor/header.interceptor';
import { errorsInterceptor } from './core/Interceptor/errors.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { loadingInterceptor } from './core/Interceptor/loading.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withInMemoryScrolling({scrollPositionRestoration:"top"})), provideClientHydration(),
    provideHttpClient(withFetch(), withInterceptors([loadingInterceptor,headerInterceptor, errorsInterceptor ]))
    , importProvidersFrom(NgxSpinnerModule )
    , provideAnimations()
  ]
};
