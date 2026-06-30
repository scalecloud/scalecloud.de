import { Component, OnInit, ChangeDetectionStrategy, inject, output, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
export class HeaderComponent implements OnInit {
  authService = inject(AuthService);
  // takeUntilDestroyed() needs an injection context to find the current
  // DestroyRef. ngOnInit() is a lifecycle hook, not an injection context, so
  // calling takeUntilDestroyed() there throws NG0203. Field initializers ARE
  // a valid injection context, so DestroyRef is injected here and passed
  // explicitly to takeUntilDestroyed() down in ngOnInit().
  private readonly destroyRef = inject(DestroyRef);

  readonly toggleSideBarForMe = output<void>();
  readonly isLoading = signal(true);

  ngOnInit() {
    this.authService.getUserObservable()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        }
      });
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