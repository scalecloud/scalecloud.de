import { Component, ChangeDetectionStrategy, inject, output } from '@angular/core';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { Auth } from 'src/app/core/auth/auth';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-header',
    templateUrl: './header.html',
    styleUrl: './header.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatToolbar, MatToolbarRow, MatIconButton, MatIcon, MatButton, RouterLink, MatMenuTrigger, MatMenu, MatMenuItem]
})
export class Header {
  readonly auth = inject(Auth);
  readonly accountSettingsUrl = `${environment.oidc.authentikUrl}/if/user/#/settings;%7B%22page%22:%22page-credentials%22,%22ak-user-settings-mfa-page%22:0%7D`;
  private readonly router = inject(Router);

  readonly toggleSideBarForMe = output<void>();

  get accountInitials(): string {
    const user = this.auth.user();
    const identity = (user?.displayName || user?.email || '').trim();
    const name = identity.includes('@') ? identity.split('@')[0] : identity;
    const parts = name.split(/[\s._-]+/).filter(Boolean);

    if (parts.length === 0) {
      return '';
    }

    return parts.length > 1
      ? `${parts[0][0]}${parts.at(-1)?.[0] ?? ''}`.toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  }

  login() {
    this.auth.login(this.router.url);
  }

  logout() {
    this.auth.logout();
  }

  toggleSideBar() {
    this.toggleSideBarForMe.emit(undefined);
  }

}