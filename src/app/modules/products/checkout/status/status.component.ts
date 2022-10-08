import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LogService } from 'src/app/shared/services/log/log.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent {

  setup_intent: string | undefined;
  setup_intent_client_secret: string | undefined;
  redirect_status: string | undefined;

  constructor(
    private logService: LogService,
    private route: ActivatedRoute,
  ) { }

  ngAfterViewInit(): void {
    this.initParamMap();
  }

  initParamMap(): void {
    const queryParamMap = this.route.snapshot.queryParamMap;
    if (queryParamMap.has('setup_intent')) {
      const setup_intent = queryParamMap.get('setup_intent');
      if (setup_intent) {
        this.setup_intent = setup_intent;
      }
    }
    if (queryParamMap.has('setup_intent_client_secret')) {
      const setup_intent_client_secret = queryParamMap.get('setup_intent_client_secret');
      if (setup_intent_client_secret) {
        this.setup_intent_client_secret = setup_intent_client_secret;
      }
    }
    if (queryParamMap.has('redirect_status')) {
      const redirect_status = queryParamMap.get('redirect_status');
      if (redirect_status) {
        this.redirect_status = redirect_status;
      }
    }
  }

}
