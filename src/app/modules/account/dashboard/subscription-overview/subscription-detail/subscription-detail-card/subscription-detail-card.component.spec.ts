import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionDetailCardComponent } from './subscription-detail-card.component';
import { describe, beforeEach, it, expect } from 'vitest';

describe('SubscriptionDetailCardComponent', () => {
  let component: SubscriptionDetailCardComponent;
  let fixture: ComponentFixture<SubscriptionDetailCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscriptionDetailCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionDetailCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
