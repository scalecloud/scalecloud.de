import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TitelCardComponent } from '../titel-card/titel-card.component';

import { SynologyComponent } from './synology.component';

describe('SynologyComponent', () => {
  let component: SynologyComponent;
  let fixture: ComponentFixture<SynologyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SynologyComponent,
        TitelCardComponent
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SynologyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
