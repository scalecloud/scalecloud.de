import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { SnackBarService } from 'src/app/core/snackbar/snack-bar.service';
import { MatDivider } from '@angular/material/divider';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { GlobeComponent } from './globe/globe.component';
import { NewsletterSubscribeComponent } from 'src/app/shared/components/newsletter/newsletter-subscribe/newsletter-subscribe.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [GlobeComponent, MatDivider, MatButton, RouterLink, NewsletterSubscribeComponent]
})
export class HomeComponent implements OnInit {
  snackBarService = inject(SnackBarService);

  ngOnInit(): void {
    this.snackBarService.errorDuration("This Website is currently under construction. Please come back later.", 30);
  }

}
