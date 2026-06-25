import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsletterConfirmComponent } from './newsletter-confirm.component';
import { describe, beforeEach, it, expect } from 'vitest';

describe('NewsletterConfirmComponent', () => {
  let component: NewsletterConfirmComponent;
  let fixture: ComponentFixture<NewsletterConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsletterConfirmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsletterConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
