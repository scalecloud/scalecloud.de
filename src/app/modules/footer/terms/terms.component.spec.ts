import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsComponent } from './terms.component';
import { describe, beforeEach, it, expect } from 'vitest';

describe('TermsComponent', () => {
  let component: TermsComponent;
  let fixture: ComponentFixture<TermsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TermsComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(TermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
