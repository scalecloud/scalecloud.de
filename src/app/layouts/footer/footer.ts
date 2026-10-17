import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { RouterLink } from '@angular/router';
import { Consent } from 'src/app/core/consent/consent';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.html',
    styleUrls: ['./footer.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatDivider, RouterLink]
})
export class Footer {
    private readonly consent = inject(Consent);

    openCookieSettings(): void {
        this.consent.reopen();
    }
}
