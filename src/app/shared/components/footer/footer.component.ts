import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatDivider, RouterLink]
})
export class FooterComponent {
}
