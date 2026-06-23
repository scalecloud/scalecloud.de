import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-legal',
    templateUrl: './legal.component.html',
    styleUrls: ['./legal.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [CommonModule]
})
export class LegalComponent {

}
