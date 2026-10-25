import { Component, Signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';
import { PermissionStore } from 'src/app/core/permission-store/permission-store';
import { Auth } from 'src/app/core/auth/auth';

@Component({
    selector: 'app-default-layout',
    templateUrl: './default-layout.html',
    styleUrl: './default-layout.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [Header, MatProgressBar, MatIcon, RouterLink, RouterLinkActive, RouterOutlet, Footer]
})
export class DefaultLayout {
  private readonly permissionStore = inject(PermissionStore);
  readonly auth = inject(Auth);
  readonly isLoading: Signal<boolean> = this.permissionStore.loadingPermissions;
}