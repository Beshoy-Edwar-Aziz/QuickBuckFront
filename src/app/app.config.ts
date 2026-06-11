import { ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideNgxStripe } from 'ngx-stripe';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideNativeDateAdapter } from '@angular/material/core';
import { httpInterceptor } from './Interceptors/http.interceptor';

export const appConfig: ApplicationConfig = {

  providers: [provideRouter(routes,withHashLocation()),provideHttpClient(withInterceptors([httpInterceptor])),provideNgxStripe(), provideAnimationsAsync(),provideNativeDateAdapter()],
};
