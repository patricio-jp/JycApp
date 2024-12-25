import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeArg from '@angular/common/locales/es-AR';
import { jwtInterceptor } from './app/interceptors/jwt.interceptor';
import { APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthService } from './app/services/auth.service';
//import {} from '@angular/common/locales/es-419';

registerLocaleData(localeArg);

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptors([jwtInterceptor])),
    importProvidersFrom([
      JwtModule.forRoot({
        config: {
          tokenGetter: () => localStorage.getItem('access_token'),
        },
      }),
    ]),
    {
      provide: APP_INITIALIZER,
      useFactory: initializerFactory,
      multi: true,
      deps: [AuthService],
    },
  ],
});

export function initializerFactory(authService: AuthService) {
  return () => authService.refreshToken();
}
