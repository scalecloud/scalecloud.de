import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatNavList, MatListItem, MatListSubheaderCssMatStyler } from '@angular/material/list';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.html',
    styleUrl: './sidebar.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatNavList, MatListItem, RouterLinkActive, RouterLink, MatIcon, MatDivider, MatListSubheaderCssMatStyler]
})
export class Sidebar {
}
