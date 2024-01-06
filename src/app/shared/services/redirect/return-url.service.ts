import { Inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { LogService } from '../log/log.service';
import { DOCUMENT, Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ReturnUrlService {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private logService: LogService,
    @Inject(DOCUMENT) private document: Document,
    private location: Location,
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
    this.logService.info('openReturnURL: ' + defaultUrl);
    const returnURL = this.route.snapshot.queryParamMap.get('returnUrl');
    if (returnURL) {
      const returnUrlDecoded = decodeURIComponent(returnURL);
      const urlTree: UrlTree = this.router.parseUrl(returnUrlDecoded || defaultUrl);
      this.router.navigateByUrl(urlTree);
    }
    else {
      this.router.navigate([defaultUrl]);
    }
    this.logService.info('openReturnURL: ' + defaultUrl + ' done');
  }

  public getSpecifiedUrlWithReturnUrl(specifiedRoute: string): string {
    let continueUrl = 'https://www.scalecloud.de';
    let decodedReturnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    if (decodedReturnUrl && specifiedRoute) {
      const domain = this.document.location.origin;
      if (domain && specifiedRoute.startsWith('/'))
        continueUrl = domain + specifiedRoute + "?returnUrl=" + decodedReturnUrl;
    }
    return continueUrl;
  }

  public getReturnUrlButtonName(defaultButtonName: string): string {
    const returnUrl = this.getReturnUrlDecoded();
    if (returnUrl) {
      const pathSegments = returnUrl.split('/');
      defaultButtonName = pathSegments[pathSegments.length - 1].toUpperCase();
    }
    return defaultButtonName;
  }

  public getReturnUrlDecoded(): string {
    let continueUrl = 'https://www.scalecloud.de';
    const returnURL = this.route.snapshot.queryParamMap.get('returnUrl');

    if (returnURL && this.document && this.document.location) {
      const domain = this.document.location.origin;
      const decodedReturnUrl = decodeURIComponent(returnURL);

      if (domain && decodedReturnUrl.startsWith('/')) {
        continueUrl = domain + decodedReturnUrl;
      }
    }
    return continueUrl;
  }

  public openUrlAddReturnUrl(url: string): void {
    const returnUrl = this.location.path();
    this.router.navigate([url], { queryParams: { returnUrl } });
  }

}
