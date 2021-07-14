import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TitelCardComponent } from '../titel-card/titel-card.component';

import { NextcloudComponent } from './nextcloud.component';

describe('NextcloudComponent', () => {
  let component: NextcloudComponent;
  let fixture: ComponentFixture<NextcloudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        NextcloudComponent,
        TitelCardComponent
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NextcloudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
