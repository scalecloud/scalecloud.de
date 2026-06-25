import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatDetailComponent } from './seat-detail.component';
import { describe, beforeEach, it, expect } from 'vitest';

describe('SeatDetailComponent', () => {
  let component: SeatDetailComponent;
  let fixture: ComponentFixture<SeatDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeatDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeatDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
