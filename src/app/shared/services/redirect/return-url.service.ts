import { Injectable } from '@angular/core';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ReturnUrlService {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  public openUrlKeepReturnUrl(url: string) {
    const retUrl = decodeURIComponent(this.route.snapshot.queryParamMap.get('returnUrl'));
    this.router.navigate([url], { queryParams: { returnUrl: retUrl } });
  }

  public openReturnURL(defaultUrl: string) {
    const returnUrl = decodeURIComponent(this.route.snapshot.queryParamMap.get('returnUrl'));
    const urlTree: UrlTree = this.router.parseUrl(returnUrl || defaultUrl);
    this.router.navigateByUrl(urlTree);
  }
}
