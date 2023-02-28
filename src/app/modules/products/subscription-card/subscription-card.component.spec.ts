import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatLegacyCard as MatCard, MatLegacyCardActions as MatCardActions, MatLegacyCardContent as MatCardContent, MatLegacyCardSubtitle as MatCardSubtitle, MatLegacyCardTitle as MatCardTitle } from '@angular/material/legacy-card';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';


import { SubscriptionCardComponent } from './subscription-card.component';

describe('SubscriptionCardComponent', () => {
  let component: SubscriptionCardComponent;
  let fixture: ComponentFixture<SubscriptionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SubscriptionCardComponent,
        MatCard,
        MatIcon,
        MatDivider,
        MatCardActions,
        MatCardTitle,
        MatCardContent,
        MatCardSubtitle
      ],
      imports: [
        MatListModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
