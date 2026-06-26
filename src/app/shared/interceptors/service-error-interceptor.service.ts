import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { SnackBarService } from '../services/snackbar/snack-bar.service';
import { LogService } from '../services/log/log.service';

export const serviceErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBarService = inject(SnackBarService);
  const logService = inject(LogService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred! Please try again later.';
      let backendError = '';
      if (error.error.error) {
        backendError = error.error.error;
      }
      if (error.status) {
        // Server-side error
        switch (error.status) {
          case 0:
            errorMessage = 'Unable to connect to the server. Please try again later.';
            break;
          case 403:
            if (backendError) {
              errorMessage = 'You do not have permission to access this resource. Backend: ' + backendError;
            }
            else {
              logService.error('missing backend error message in 403 error');
              errorMessage = 'You do not have permission to access this resource.';
            }
            break;
          case 404:
            if (backendError) {
              errorMessage = 'The requested resource was not found. Backend: ' + backendError;
            } else {
              logService.error('missing backend error message in 404 error');
              errorMessage = 'The requested resource was not found.';
            }
            break;
          case 408:
            errorMessage = 'The request timed out. Please try again later.';
            break;
          case 429:
            errorMessage = 'You have made too many requests. Please wait and try again later.';
            break;
          case 500:
            if (backendError) {
              errorMessage = 'An internal server error occurred. Please try again later. Backend: ' + backendError;
            } else {
              logService.error('missing backend error message in 500 error');
              errorMessage = 'An internal server error occurred. Please try again later.';
            }
            break;
          case 502:
            errorMessage = 'Bad gateway. Please try again later.';
            break;
          case 503:
            errorMessage = 'The service is currently unavailable. Please try again later.';
            break;
          default:
            if (backendError) {
              errorMessage = 'An internal server error occurred. Please try again later. Backend: ' + backendError;
            } else {
              logService.error('missing backend error message in default error');
              errorMessage = 'An internal server error occurred. Please try again later.';
            }
            break;
        }
      }
      snackBarService.error(errorMessage);
      return throwError(() => new Error(errorMessage));
    })
  );
}