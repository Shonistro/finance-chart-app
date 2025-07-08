import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../../service/auth/auth.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const authToken = authService.getToken();
  const authTokenLocalStorage = localStorage.getItem('access_token')

  if (authTokenLocalStorage) {
    const auth_request = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authTokenLocalStorage}`,
      },
    });
    return next(auth_request);
  }
  return next(req);
};
