import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const tokenInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const auth = inject(AuthService);

  if (auth.isAuthenticated()) {
    req = req.clone({ setHeaders: { Authorization: auth.getToken() } });
  }
  
  return next(req);
};
