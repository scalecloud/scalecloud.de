import { Component, Signal, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from '@angular/material/sidenav';
import { Sidebar } from '../sidebar/sidebar';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';
import { PermissionStore } from 'src/app/core/permission-store/permission-store';

@Component({
    selector: 'app-default',
    templateUrl: './default.html',
    styleUrls: ['./default.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [Header, MatProgressBar, MatDrawerContainer, MatDrawer, Sidebar, MatDrawerContent, RouterOutlet, Footer]
})
export class Default {
  private readonly permissionStore = inject(PermissionStore);

  readonly isExpanded = signal(true);
  readonly isShowing = signal(false);
  readonly isLoading: Signal<boolean> = this.permissionStore.loadingPermissions;

  sideBarToggler(): void {
    this.isExpanded.update((expanded) => !expanded);

    // Collapsing the drawer permanently shouldn't leave a stale flyout open.
    if (this.isExpanded()) {
      this.isShowing.set(false);
    }
  }

  mouseenter(): void {
    if (!this.isExpanded()) {
      this.isShowing.set(true);
    }
  }

  mouseleave(): void {
    if (!this.isExpanded()) {
      this.isShowing.set(false);
    }
  }
}