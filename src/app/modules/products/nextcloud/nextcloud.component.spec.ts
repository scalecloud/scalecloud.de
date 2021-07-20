import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCard, MatCardActions, MatCardContent, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { SubscriptionCardComponent } from '../subscription-card/subscription-card.component';
import { TitelCardComponent } from '../titel-card/titel-card.component';
import { NextcloudComponent } from './nextcloud.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

describe('NextcloudComponent', () => {
  let component: NextcloudComponent;
  let fixture: ComponentFixture<NextcloudComponent>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

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

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
