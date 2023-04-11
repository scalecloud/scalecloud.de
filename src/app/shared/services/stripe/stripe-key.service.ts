import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LogService } from '../log/log.service';

@Injectable({
  providedIn: 'root'
})
export class StripeKeyService {

  readonly publicKeyTest: string = "pk_test_51Gv4psA86yrbtIQrTHaoHoe5ssyYqEYd6N9Uc8xxodxLFDb19cV5ORUqAeH3Y09sghwvN52lzNt111GIxw7W8sLo00TyE22PC3"
  readonly publicKeyLive: string = ""

  constructor(
    private logService: LogService,
    private router: Router
  ) { }

  getPublicKey(): string | undefined {
    let key = undefined;
    if (this.isLocalhost() || this.isBeta()) {
      key = this.publicKeyTest;
      this.logService.info("Using publicKeyTest")
    }
    else if (this.isLive()) {
      key = this.publicKeyLive;
      this.logService.info("Using publicKeyLive")
    }
    else {
      this.logService.error("Could not get PublicKey.")
    }
    return key;
  }

  getURL(): string {
    return window.location.href;
  }

  isLocalhost(): boolean {
    let localhost = false;
    if (this.getURL().includes("localhost")) {
      localhost = true;
    }
    return localhost;
  }

  isBeta(): boolean {
    let beta = false;
    if (this.getURL().startsWith("https://beta.scalecloud.de")) {
      beta = true;
    }
    return beta;
  }

  isLive(): boolean {
    let live = false;
    if (this.getURL().startsWith("https://www.scalecloud.de")) {
      live = true;
    }
    return live;
  }

}
