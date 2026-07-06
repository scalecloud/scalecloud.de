import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingFailed } from './loading-failed';
import { describe, beforeEach, it, expect } from 'vitest';

describe('LoadingFailed', () => {
  let component: LoadingFailed;
  let fixture: ComponentFixture<LoadingFailed>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingFailed]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingFailed);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
