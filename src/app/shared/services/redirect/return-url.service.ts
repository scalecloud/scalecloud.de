import { Inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { LogService } from '../log/log.service';
import { DOCUMENT, Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ReturnUrlService {

  private readonly baseURL: string = 'https://www.scalecloud.de';

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
    const returnURL = this.route.snapshot.queryParamMap.get('returnUrl');
    if (returnURL) {
      const returnUrlDecoded = decodeURIComponent(returnURL);
      const urlTree: UrlTree = this.router.parseUrl(returnUrlDecoded || defaultUrl);
      this.logService.info('Opening returnUrl: ' + urlTree.toString());
      this.router.navigateByUrl(urlTree);
    }
    else {
      this.logService.error('ReturnUrl not in query params. Open defaultUrl: ' + defaultUrl);
      this.router.navigate([defaultUrl]);
    }
  }

  public getSpecifiedUrlWithReturnUrl(specifiedRoute: string): string {
    let continueUrl = this.baseURL;

    const domain = this.document.location.origin;
    if (specifiedRoute && domain && specifiedRoute.startsWith('/')) {
      const queryParams = this.route.snapshot.queryParams;
      const queryString = new URLSearchParams(queryParams as any).toString();
      continueUrl = domain + specifiedRoute + "?" + queryString;
    }
    if( continueUrl === this.baseURL ) {
      this.logService.error('getSpecifiedUrlWithReturnUrl failed: ' + continueUrl);
    }
    return continueUrl;
  }

  public getReturnUrlButtonName(defaultButtonName: string): string {
    const returnUrl = this.getReturnUrlDecoded();
    if (returnUrl) {
      const url = new URL(returnUrl);
      const pathSegments = url.pathname.split('/');
      const lastSegment = pathSegments[pathSegments.length - 1];
      defaultButtonName = lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).toLowerCase();
    }
    return defaultButtonName;
  }

  public getReturnUrlDecoded(): string {
    let continueUrl = this.baseURL;
    const returnURL = this.route.snapshot.queryParamMap.get('returnUrl');

    if (returnURL && this.document && this.document.location) {
      const domain = this.document.location.origin;
      const decodedReturnUrl = decodeURIComponent(returnURL);

      if (domain && decodedReturnUrl.startsWith('/')) {
        continueUrl = domain + decodedReturnUrl;
      }
    }
    if( continueUrl === this.baseURL ) {
      this.logService.error('getReturnUrlDecoded failed: ' + continueUrl);
    }
    return continueUrl;
  }

  public openUrlAddReturnUrl(url: string): void {
    const returnUrl = this.location.path();
    this.router.navigate([url], { queryParams: { returnUrl } });
  }

}
