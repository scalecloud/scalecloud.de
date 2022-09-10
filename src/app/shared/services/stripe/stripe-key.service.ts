import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LogService } from '../log/log.service';

@Injectable({
  providedIn: 'root'
})
export class StripeKeyService {

  readonly publicKeyTest: string = "pk_test_51Gv4psA86yrbtIQrTHaoHoe5ssyYqEYd6N9Uc8xxodxLFDb19cV5ORUqAeH3Y09sghwvN52lzNt111GIxw7W8sLo00TyE22PC3"
  readonly publicKeyLive: string = ""

  constructor(
    private logService: LogService,
    private route: ActivatedRoute,
  ) { }

  getPublicKey(): string | undefined {
    let key = undefined;
    if( this.isLocalhost() || this.isBeta() ) {
      key = this.publicKeyTest;
    }
    else if( this.isLive() ) {
      key = this.publicKeyLive;
    }
    else {
      this.logService.error("Could not get PublicKey.")
    }
    return key;
  }

  isLocalhost(): boolean {
    //const queryParamMap = this.route.snapshot.;
    this.logService.info("url: " + this.route.snapshot.url)


    return false;
  }

  isBeta(): boolean {
    return false;
  }

  isLive(): boolean {
    return false;
  }

}
