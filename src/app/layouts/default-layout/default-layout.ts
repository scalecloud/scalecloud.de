import { Component, Signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';
import { PermissionStore } from 'src/app/core/permission-store/permission-store';
import { MobileBottomNav } from '../mobile-bottom-nav/mobile-bottom-nav';

@Component({
    selector: 'app-default-layout',
    templateUrl: './default-layout.html',
    styleUrl: './default-layout.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [Header, MatProgressBar, RouterOutlet, Footer, MobileBottomNav]
})
export class DefaultLayout {
  private readonly permissionStore = inject(PermissionStore);
  readonly isLoading: Signal<boolean> = this.permissionStore.loadingPermissions;
}