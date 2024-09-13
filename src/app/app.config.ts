import { ApplicationConfig, importProvidersFrom , provideZoneChangeDetection} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HttpClient, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { headerInterceptor } from './core/Interceptor/header.interceptor';
import { errorsInterceptor } from './core/Interceptor/errors.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { loadingInterceptor } from './core/Interceptor/loading.interceptor';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { provideToastr } from 'ngx-toastr';




// Create Function To Load Files from assets/i18n/

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


export const appConfig: ApplicationConfig = {

  

  providers: [
    provideAnimations(),
    provideToastr(),
    provideRouter(routes, withInMemoryScrolling({scrollPositionRestoration:"top"})),
    provideClientHydration(),
    provideHttpClient(withFetch(), withInterceptors([loadingInterceptor,headerInterceptor, errorsInterceptor]))
    , 
    importProvidersFrom(TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      }),

      NgxSpinnerModule 
    )
  ]
};


