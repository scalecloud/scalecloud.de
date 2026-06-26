import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LogService } from 'src/app/shared/services/log/log.service';
import { MatCard, MatCardTitle, MatCardContent, MatCardActions } from '@angular/material/card';
import { MatList } from '@angular/material/list';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-page-not-found',
    templateUrl: './page-not-found.component.html',
    styleUrls: ['./page-not-found.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCard, MatCardTitle, MatCardContent, MatList, MatCardActions, MatButton, RouterLink]
})
export class PageNotFoundComponent implements OnInit {

  constructor(
    private readonly router: Router,
    private readonly logService: LogService
  ) {}

  ngOnInit(): void {
    this.logService.error('Page not found: ' + this.router.url);
  }

}
