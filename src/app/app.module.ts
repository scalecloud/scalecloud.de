import { APP_BOOTSTRAP_LISTENER, ErrorHandler, NgModule } from "@angular/core";
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { CurrencyPipe } from '@angular/common';
import { Router } from "@angular/router";
import * as Sentry from "@sentry/angular";

// Firebase JS SDK
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { getPerformance } from 'firebase/performance';

// Firebase einmalig initialisieren (Singleton)
const firebaseApp = initializeApp(environment.firebaseConfig);
export const auth = getAuth(firebaseApp);
export const analytics = getAnalytics(firebaseApp);
export const perf = getPerformance(firebaseApp);

