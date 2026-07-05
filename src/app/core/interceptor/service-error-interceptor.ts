import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { SnackBarService } from '../snackbar/snack-bar.service';
import { Log } from '../logging/log';

export const serviceErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBarService = inject(SnackBarService);
  const logService = inject(Log);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const backendError = error.error?.error ?? '';

      const withBackend = (base: string, logLabel: string): string => {
        if (backendError) {
          return `${base} Backend: ${backendError}`;
        }
        logService.error(`missing backend error message in ${logLabel} error`);
        return base;
      };

      let errorMessage: string;
      // error.status is always defined on HttpErrorResponse (0 means no connection),
      // so this must not be a truthiness check - `if (error.status)` skipped case 0.
      switch (error.status) {
        case 0:
          errorMessage = 'Unable to connect to the server. Please try again later.';
          break;
        case 403:
          errorMessage = withBackend('You do not have permission to access this resource.', '403');
          break;
        case 404:
          errorMessage = withBackend('The requested resource was not found.', '404');
          break;
        case 408:
          errorMessage = 'The request timed out. Please try again later.';
          break;
        case 429:
          errorMessage = 'You have made too many requests. Please wait and try again later.';
          break;
        case 500:
          errorMessage = withBackend('An internal server error occurred. Please try again later.', '500');
          break;
        case 502:
          errorMessage = 'Bad gateway. Please try again later.';
          break;
        case 503:
          errorMessage = 'The service is currently unavailable. Please try again later.';
          break;
        default:
          errorMessage = withBackend('An internal server error occurred. Please try again later.', 'default');
          break;
      }

      snackBarService.error(errorMessage);
      return throwError(() => new Error(errorMessage));
    })
  );
}