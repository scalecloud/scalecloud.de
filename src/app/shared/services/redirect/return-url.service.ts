import { Injectable } from '@angular/core';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { LogService } from '../log/log.service';

@Injectable({
  providedIn: 'root'
})
export class ReturnUrlService {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private logService: LogService,
  ) { }

  public openUrlKeepReturnUrl(url: string) {
    const returnURL = this.route.snapshot.queryParamMap.get('returnUrl');
    if (returnURL) {
      const retUrl = decodeURIComponent(returnURL);
      this.router.navigate([url], { queryParams: { returnUrl: retUrl } });
    }
    else {
      this.logService.error('ReturnUrl not in query params.');
      this.router.navigateByUrl(url);
    }
  }

  public openReturnURL(defaultUrl: string) {
    const returnURL = this.route.snapshot.queryParamMap.get('returnUrl');
    if (returnURL) {
      const returnUrlDecoded = decodeURIComponent(returnURL);
      const urlTree: UrlTree = this.router.parseUrl(returnUrlDecoded || defaultUrl);
      this.router.navigateByUrl(urlTree);
    }
    else {
      this.router.navigate([defaultUrl]);
    }
  }
}
