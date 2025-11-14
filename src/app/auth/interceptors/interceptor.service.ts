import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor{

  constructor() { }
   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const Token = localStorage.getItem('token');

    if (Token) {
      const cloned = req.clone({
        setHeaders: { Authorization: `Bearer ${Token}` }
      });
      return next.handle(cloned);
    }
    return next.handle(req);
  }
  
}
