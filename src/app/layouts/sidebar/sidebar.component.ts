import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { MatNavList, MatListItem, MatListSubheaderCssMatStyler } from '@angular/material/list';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatNavList, MatListItem, RouterLinkActive, RouterLink, MatIcon, MatDivider, MatListSubheaderCssMatStyler]
})
export class SidebarComponent {

  readonly isExpanded = input<boolean | undefined>(undefined);
  readonly isShowing = input<boolean | undefined>(undefined);

}
