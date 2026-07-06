import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.html',
    styleUrls: ['./footer.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatDivider, RouterLink]
})
export class Footer {
}
