import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeSubscriptionComponent } from './resume-subscription.component';
import { describe, beforeEach, it, expect } from 'vitest';

describe('ResumeSubscriptionComponent', () => {
  let component: ResumeSubscriptionComponent;
  let fixture: ComponentFixture<ResumeSubscriptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResumeSubscriptionComponent]
    });
    fixture = TestBed.createComponent(ResumeSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
