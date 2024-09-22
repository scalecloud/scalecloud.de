import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LastCountService {

  private lastSubscriptionOverviewCount: number = 1;

  get getLastSubscriptionOverviewCount(): number {
    return this.lastSubscriptionOverviewCount;
  }

  set setLastSubscriptionOverviewCount(count: number) {
    this.lastSubscriptionOverviewCount = count;
  }
}
