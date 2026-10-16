import { Component, ChangeDetectionStrategy, inject, output } from '@angular/core';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { Auth } from 'src/app/core/auth/auth';

@Component({
    selector: 'app-header',
    templateUrl: './header.html',
    styleUrls: ['./header.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatToolbar, MatToolbarRow, MatIconButton, MatIcon, MatButton, RouterLink, MatMenuTrigger, MatMenu, MatMenuItem]
})
export class Header {
  readonly auth = inject(Auth);
  private readonly router = inject(Router);

  readonly toggleSideBarForMe = output<void>();

  login() {
    this.auth.login(this.router.url);
  }

  register() {
    this.auth.register(this.router.url);
  }

  logout() {
    this.auth.logout();
  }

  toggleSideBar() {
    this.toggleSideBarForMe.emit(undefined);
    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      );
    }, 300);
  }

}