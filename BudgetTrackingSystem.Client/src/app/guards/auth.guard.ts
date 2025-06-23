import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  console.log('Auth guard checking for route:', state.url);
  const isAuth = authService.isAuthenticated();
  console.log('User authenticated:', isAuth);
  
  if (isAuth) {
    return true;
  }
  
  console.log('Redirecting to login...');
  // Redirect to login page with return url
  router.navigate(['/login'], { 
    queryParams: { returnUrl: state.url }
  });
  
  return false;
};