import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LogService } from 'src/app/shared/services/log/log.service';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
  standalone: false
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
