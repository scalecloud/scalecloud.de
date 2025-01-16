import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    standalone: false
})
export class SidebarComponent {

  @Input() isExpanded: boolean | undefined;
  @Input() isShowing: boolean | undefined;

}
