import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactPage } from './contact-page';
import { describe, beforeEach, it, expect } from 'vitest';

describe('ContactPage', () => {
  let component: ContactPage;
  let fixture: ComponentFixture<ContactPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ContactPage]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
