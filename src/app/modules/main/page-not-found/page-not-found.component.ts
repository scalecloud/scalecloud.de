import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LogService } from 'src/app/shared/services/log/log.service';
import { MatCard, MatCardTitle, MatCardContent, MatCardActions } from '@angular/material/card';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-page-not-found',
    templateUrl: './page-not-found.component.html',
    styleUrls: ['./page-not-found.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCard, MatCardTitle, MatCardContent, MatCardActions, MatButton, RouterLink]
})
export class PageNotFoundComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly logService = inject(LogService);

  ngOnInit(): void {
    this.logService.error('Page not found: ' + this.router.url);
  }

}