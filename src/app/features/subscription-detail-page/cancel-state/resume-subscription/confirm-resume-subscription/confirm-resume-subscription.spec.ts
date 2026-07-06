import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmResumeSubscription } from './confirm-resume-subscription';
import { describe, beforeEach, it, expect } from 'vitest';

describe('ConfirmResumeSubscription', () => {
  let component: ConfirmResumeSubscription;
  let fixture: ComponentFixture<ConfirmResumeSubscription>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [ConfirmResumeSubscription]
});
    fixture = TestBed.createComponent(ConfirmResumeSubscription);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
