import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyPage } from './privacy-page';
import { describe, beforeEach, it, expect } from 'vitest';

describe('PrivacyPage', () => {
  let component: PrivacyPage;
  let fixture: ComponentFixture<PrivacyPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [PrivacyPage]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
