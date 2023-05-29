import {Router} from '@angular/router';
import {NbAuthService} from '@nebular/auth';
import {inject} from '@angular/core';

export const authGuard = () => {
  const authService = inject(NbAuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }
  // Redirect to the login page
  return router.navigateByUrl('/auth/login');
};
