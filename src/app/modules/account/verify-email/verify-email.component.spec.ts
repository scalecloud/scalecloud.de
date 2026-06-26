import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyEmailComponent } from './verify-email.component';
import { describe, beforeEach, it, expect } from 'vitest';

describe('VerifyEmailComponent', () => {
  let component: VerifyEmailComponent;
  let fixture: ComponentFixture<VerifyEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [VerifyEmailComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
