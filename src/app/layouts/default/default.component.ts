import { Component, Signal, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from '@angular/material/sidenav';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { Permission } from 'src/app/core/permission/permission';

@Component({
    selector: 'app-default',
    templateUrl: './default.component.html',
    styleUrls: ['./default.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [HeaderComponent, MatProgressBar, MatDrawerContainer, MatDrawer, SidebarComponent, MatDrawerContent, RouterOutlet, FooterComponent]
})
export class DefaultComponent {
  private readonly permission = inject(Permission);

  readonly isExpanded = signal(true);
  readonly isShowing = signal(false);
  readonly isLoading: Signal<boolean> = this.permission.loadingPermissions;

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