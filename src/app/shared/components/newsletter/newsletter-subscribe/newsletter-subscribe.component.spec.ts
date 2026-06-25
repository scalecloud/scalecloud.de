import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsletterSubscribeComponent } from './newsletter-subscribe.component';
import { describe, beforeEach, it, expect } from 'vitest';

describe('NewsletterSubscribeComponent', () => {
  let component: NewsletterSubscribeComponent;
  let fixture: ComponentFixture<NewsletterSubscribeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsletterSubscribeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsletterSubscribeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
