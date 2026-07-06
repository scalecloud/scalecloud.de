import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, beforeEach, it, expect, vi } from 'vitest';

import { Processing } from './processing';
import { ReturnUrl } from 'src/app/core/redirect/return-url';

describe('Processing', () => {
  let component: Processing;
  let fixture: ComponentFixture<Processing>;
  let returnUrlMock: { openReturnURL: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    returnUrlMock = {
      openReturnURL: vi.fn()
    };

    TestBed.configureTestingModule({
      imports: [Processing],
      providers: [
        { provide: ReturnUrl, useValue: returnUrlMock }
      ]
    });

    fixture = TestBed.createComponent(Processing);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the processing title', () => {
    const title: HTMLElement = fixture.nativeElement.querySelector('mat-card-title');
    expect(title?.textContent).toContain('Processing payment details');
  });

  it('should display both informational list items', () => {
    const items = fixture.nativeElement.querySelectorAll('mat-list-item');
    expect(items.length).toBe(2);
    expect(items[0].textContent).toContain('Your payment details are being processed.');
    expect(items[1].textContent).toContain('You can manage your Subscription in your Dashboard.');
  });

  it('should render a Return button', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button).toBeTruthy();
    expect(button.textContent).toContain('Return');
  });

  it('should call returnUrl.openReturnURL with "/dashboard" when openReturnUrl is invoked', () => {
    component.openReturnUrl();
    expect(returnUrlMock.openReturnURL).toHaveBeenCalledTimes(1);
    expect(returnUrlMock.openReturnURL).toHaveBeenCalledWith('/dashboard');
  });

  it('should call openReturnUrl when the Return button is clicked', async () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    button.click();
    await fixture.whenStable();

    expect(returnUrlMock.openReturnURL).toHaveBeenCalledTimes(1);
    expect(returnUrlMock.openReturnURL).toHaveBeenCalledWith('/dashboard');
  });
});