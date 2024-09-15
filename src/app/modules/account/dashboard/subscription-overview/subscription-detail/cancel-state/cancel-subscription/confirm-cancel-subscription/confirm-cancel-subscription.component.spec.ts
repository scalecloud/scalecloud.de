import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmCancelSubscriptionComponent } from './confirm-cancel-subscription.component';

describe('ConfirmCancelSubscriptionComponent', () => {
  let component: ConfirmCancelSubscriptionComponent;
  let fixture: ComponentFixture<ConfirmCancelSubscriptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmCancelSubscriptionComponent]
    });
    fixture = TestBed.createComponent(ConfirmCancelSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
