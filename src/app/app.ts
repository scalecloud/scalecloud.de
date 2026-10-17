import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CookieBanner } from './core/consent/cookie-banner';
import { Tracking } from './core/consent/tracking';

@Component({
    selector: 'app-root',
    templateUrl: './app.html',
    styleUrls: ['./app.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterOutlet, CookieBanner]
})
export class App {
  title = 'scalecloud';

  constructor() {
    inject(Tracking);
  }
}