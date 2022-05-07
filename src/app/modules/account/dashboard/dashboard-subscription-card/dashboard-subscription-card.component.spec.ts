import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSubscriptionCardComponent } from './dashboard-subscription-card.component';

describe('DashboardSubscriptionCardComponent', () => {
  let component: DashboardSubscriptionCardComponent;
  let fixture: ComponentFixture<DashboardSubscriptionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardSubscriptionCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardSubscriptionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
