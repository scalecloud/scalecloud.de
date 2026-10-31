import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatDivider } from '@angular/material/divider';

@Component({
    selector: 'app-title-card',
    templateUrl: './title-card.html',
    styleUrls: ['./title-card.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatDivider]
})
export class TitleCard {
}
