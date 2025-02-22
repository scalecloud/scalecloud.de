import { Component, Signal } from '@angular/core';
import { PermissionService } from 'src/app/shared/services/permission/permission.service';

@Component({
    selector: 'app-default',
    templateUrl: './default.component.html',
    styleUrls: ['./default.component.scss'],
    standalone: false
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