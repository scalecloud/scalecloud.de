import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, Signal, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from '@angular/material/sidenav';
import { map } from 'rxjs';
import { Sidebar } from '../sidebar/sidebar';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';
import { PermissionStore } from 'src/app/core/permission-store/permission-store';

@Component({
    selector: 'app-default-layout',
    templateUrl: './default-layout.html',
    styleUrl: './default-layout.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [Header, MatProgressBar, MatDrawerContainer, MatDrawer, Sidebar, MatDrawerContent, RouterOutlet, Footer]
})
export class DefaultLayout {
  private readonly permissionStore = inject(PermissionStore);
  private readonly handsetQuery = '(max-width: 767px)';
  private readonly breakpointObserver = inject(BreakpointObserver);

  readonly isHandset = toSignal(
    this.breakpointObserver.observe(this.handsetQuery).pipe(map(({ matches }) => matches)),
    { initialValue: this.breakpointObserver.isMatched(this.handsetQuery) },
  );
  readonly isDesktopSidebarOpen = signal(true);
  readonly isMobileSidebarOpen = signal(false);
  readonly isSidebarOpen = computed(() =>
    this.isHandset() ? this.isMobileSidebarOpen() : this.isDesktopSidebarOpen(),
  );
  readonly isLoading: Signal<boolean> = this.permissionStore.loadingPermissions;

  sideBarToggler(): void {
    if (this.isHandset()) {
      this.isMobileSidebarOpen.update((opened) => !opened);
    } else {
      this.isDesktopSidebarOpen.update((opened) => !opened);
    }
  }

  sidebarOpenedChange(opened: boolean): void {
    if (this.isHandset()) {
      this.isMobileSidebarOpen.set(opened);
    } else {
      this.isDesktopSidebarOpen.set(opened);
    }
  }

  closeSidebarAfterNavigation(): void {
    if (this.isHandset()) {
      this.isMobileSidebarOpen.set(false);
    }
  }
}