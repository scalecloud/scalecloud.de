import { Component, Signal, ChangeDetectionStrategy } from '@angular/core';
import { PermissionService } from 'src/app/shared/services/permission/permission.service';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from '@angular/material/sidenav';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
    selector: 'app-default',
    templateUrl: './default.component.html',
    styleUrls: ['./default.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [HeaderComponent, MatProgressBar, MatDrawerContainer, MatDrawer, SidebarComponent, MatDrawerContent, RouterOutlet, FooterComponent]
})
export class DefaultComponent {
  isExpanded = true;
  showSubmenu: boolean = false;
  isShowing = false;
  showSubSubMenu: boolean = false;
  isLoading: Signal<boolean>;

  constructor(
    private readonly permissionService: PermissionService
  ) {
    this.isLoading = this.permissionService.loadingPermissions;
  }

  sideBarToggler() {
    this.isExpanded = !this.isExpanded;
  }

  mouseenter() {
    if (!this.isExpanded) {
      this.isShowing = true;
    }
  }

  mouseleave() {
    if (!this.isExpanded) {
      this.isShowing = false;
    }
  }
}