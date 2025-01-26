import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {
  AuthentificationInterceptorProvider,
} from './interceptors/auth.interceptor';
import { provideToastr } from 'ngx-toastr';
import { ToastrModule } from 'ngx-toastr';
import { provideHttpClient, withInterceptorsFromDi, withInterceptors, withFetch } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import Aura from '@primeng/themes/aura';
import { provideAnimations } from '@angular/platform-browser/animations';
import { providePrimeNG } from 'primeng/config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withInterceptorsFromDi()),
    AuthentificationInterceptorProvider,
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    provideAnimations(),
    providePrimeNG({ 
      theme: {
          preset: Aura
      }
  }),
    importProvidersFrom(ToastrModule.forRoot()),provideHttpClient(
      withFetch(),
      withInterceptorsFromDi()
    ),
  ],
};