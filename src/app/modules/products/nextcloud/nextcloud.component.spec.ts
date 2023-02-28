import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatLegacyCard as MatCard, MatLegacyCardActions as MatCardActions, MatLegacyCardContent as MatCardContent, MatLegacyCardSubtitle as MatCardSubtitle, MatLegacyCardTitle as MatCardTitle } from '@angular/material/legacy-card';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { SubscriptionCardComponent } from '../subscription-card/subscription-card.component';
import { TitelCardComponent } from '../titel-card/titel-card.component';
import { NextcloudComponent } from './nextcloud.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('NextcloudComponent', () => {
  let component: NextcloudComponent;
  let fixture: ComponentFixture<NextcloudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        NextcloudComponent,
        TitelCardComponent,
        MatDivider,
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
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    fixture = TestBed.createComponent(NextcloudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
