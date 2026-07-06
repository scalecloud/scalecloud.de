import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-loading-failed',
    templateUrl: './loading-failed.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrl: './loading-failed.scss',
    imports: [MatCard, MatCardHeader, MatCardTitle, MatIcon, MatCardContent]
})
export class LoadingFailed {

}
