import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardSubscriptionOverviewComponent } from './dashboard-subscription-overview.component';


describe('DashboardSubscriptionOverviewComponent', () => {
  let component: DashboardSubscriptionOverviewComponent;
  let fixture: ComponentFixture<DashboardSubscriptionOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardSubscriptionOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardSubscriptionOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
