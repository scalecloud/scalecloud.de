import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { GlobeComponent } from '../globe/globe.component';
import { MatDivider } from '@angular/material/divider';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { NewsletterSubscribeComponent } from '../../../shared/components/newsletter/newsletter-subscribe/newsletter-subscribe.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [GlobeComponent, MatDivider, MatButton, RouterLink, NewsletterSubscribeComponent]
})
export class HomeComponent implements OnInit {
  snackBarService = inject(SnackBarService);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);


  constructor() { }

  ngOnInit(): void {
    this.snackBarService.errorDuration("This Website is currently under construction. Please come back later.", 30);
  }

}
