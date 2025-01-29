import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Observable, of } from 'rxjs';

export const authGuard: CanActivateFn = (
): Observable<boolean> => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  if (loginService.isLogged()) {
    router.navigate(['home']);
    return of(false); 
  }
  return of(true);
};
