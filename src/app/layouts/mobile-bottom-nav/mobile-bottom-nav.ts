import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from 'src/app/core/auth/auth';

@Component({
  selector: 'app-mobile-bottom-nav',
  templateUrl: './mobile-bottom-nav.html',
  styleUrl: './mobile-bottom-nav.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, RouterLink, RouterLinkActive],
})
export class MobileBottomNav {
  readonly auth = inject(Auth);
}