import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { ToastrModule } from 'ngx-toastr';
import Aura from '@primeng/themes/aura';
import {
  AuthentificationInterceptorProvider,
  AuthInterceptor,
} from './interceptor/auth.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { authInterceptor } from './interceptors/auth.interceptor';
import { providePrimeNG } from 'primeng/config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withInterceptorsFromDi()), // Only use this once
    AuthentificationInterceptorProvider, // Ensure this is added to handle interceptors
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
      withInterceptors([authInterceptor])
    ),
  ],
};