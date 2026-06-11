import { HttpInterceptorFn } from '@angular/common/http';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const local:any = localStorage.getItem('Token');
  const Token = JSON.parse(local);
  const Auth=req.clone({
    setHeaders:{
      Authorization:`Bearer ${Token}`
    }
  })
  return next(Auth);
};
