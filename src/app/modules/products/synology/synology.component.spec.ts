import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { SubscriptionCardComponent } from '../subscription-card/subscription-card.component';
import { TitelCardComponent } from '../titel-card/titel-card.component';
import { SynologyComponent } from './synology.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatCard, MatCardActions, MatCardContent, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('SynologyComponent', () => {
  let component: SynologyComponent;
  let fixture: ComponentFixture<SynologyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SynologyComponent,
        TitelCardComponent,
        MatDivider,
        SubscriptionCardComponent,
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
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    fixture = TestBed.createComponent(SynologyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
