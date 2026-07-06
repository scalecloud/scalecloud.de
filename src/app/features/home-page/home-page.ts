import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { Globe } from './globe/globe';
import { SnackBar } from 'src/app/core/snackbar/snack-bar';
import { NewsletterSubscribe } from '../newsletter-client/newsletter-subscribe/newsletter-subscribe';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.html',
    styleUrls: ['./home-page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [Globe, MatDivider, MatButton, RouterLink, NewsletterSubscribe]
})
export class HomePage implements OnInit {
  snackBar = inject(SnackBar);

  ngOnInit(): void {
    this.snackBar.errorDuration("This Website is currently under construction. Please come back later.", 30);
  }

}
