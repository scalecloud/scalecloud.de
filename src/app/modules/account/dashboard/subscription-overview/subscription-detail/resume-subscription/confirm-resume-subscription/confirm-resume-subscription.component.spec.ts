import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmResumeSubscriptionComponent } from './confirm-resume-subscription.component';

describe('ConfirmResumeSubscriptionComponent', () => {
  let component: ConfirmResumeSubscriptionComponent;
  let fixture: ComponentFixture<ConfirmResumeSubscriptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmResumeSubscriptionComponent]
    });
    fixture = TestBed.createComponent(ConfirmResumeSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
