import {
  ApplicationConfig,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  inject,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth-interceptor/auth-interceptor';
import { AuthService } from './core/service/auth/auth.service';
import { firstValueFrom } from 'rxjs';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAppInitializer(async () => {
      const authService = inject(AuthService);

      const storedToken = authService.getTokenFromLocalStorage();
      if (storedToken && authService.isTokenValid(storedToken)) {
        authService.setToken(storedToken);
      } else {
        try {
          await firstValueFrom(authService.login());
        } catch (e) {
          console.error('Auth error', e);
        }
      }
    }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
 
  ],
};
