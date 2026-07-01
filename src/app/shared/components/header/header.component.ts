import { Component, ChangeDetectionStrategy, inject, output, computed } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatToolbar, MatToolbarRow, MatIconButton, MatIcon, MatButton, RouterLink, MatProgressSpinner, MatMenuTrigger, MatMenu, MatMenuItem]
})
export class HeaderComponent {
  authService = inject(AuthService);

  readonly toggleSideBarForMe = output<void>();

  // authService.user() is `undefined` until the first auth-state event has
  // fired, then becomes `User | null`. So "still loading" is just "we
  // haven't heard from Firebase yet" - no subscription needed.
  readonly isLoading = computed(() => this.authService.user() === undefined);

  toggleSideBar() {
    this.toggleSideBarForMe.emit(undefined);
    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      );
    }, 300);
  }

}