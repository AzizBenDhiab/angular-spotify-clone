import { CanMatchFn, Router } from '@angular/router';
import { inject } from "@angular/core";
import { LoginService } from "../services/login.service";
import { of } from "rxjs";

export const loginGuard: CanMatchFn = (route, segments) => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  if (!loginService.isLogged()) {
    router.navigate(['/login']);
    return of(false); 
  }

  return of(true);
};
