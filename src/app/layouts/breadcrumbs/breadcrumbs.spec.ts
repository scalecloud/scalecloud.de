import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { Breadcrumbs } from './breadcrumbs';

@Component({ template: '', standalone: true })
class TestPage {}

describe('Breadcrumbs', () => {
  it('builds linked breadcrumbs from active route metadata', async () => {
    await TestBed.configureTestingModule({
      imports: [Breadcrumbs],
      providers: [
        provideRouter([
          {
            path: 'dashboard',
            data: { breadcrumb: 'Dashboard' },
            children: [
              {
                path: 'subscription/:subscriptionID',
                data: { breadcrumb: 'Subscription' },
                children: [
                  { path: '', component: TestPage },
                  { path: 'add-seat', data: { breadcrumb: 'Add seat' }, component: TestPage },
                ],
              },
            ],
          },
        ]),
      ],
    }).compileComponents();

    await TestBed.inject(Router).navigateByUrl('/dashboard/subscription/sub-1/add-seat');
    const fixture = TestBed.createComponent(Breadcrumbs);
    fixture.detectChanges();

    const breadcrumb = fixture.nativeElement.querySelector('nav[aria-label="Breadcrumb"]');
    const links: HTMLAnchorElement[] = Array.from(breadcrumb.querySelectorAll('a'));

    expect(links.map(link => link.textContent?.trim())).toEqual(['Dashboard', 'Subscription']);
    expect(links.map(link => link.getAttribute('href'))).toEqual([
      '/dashboard',
      '/dashboard/subscription/sub-1',
    ]);
    expect(breadcrumb.querySelector('[aria-current="page"]')?.textContent?.trim()).toBe('Add seat');
  });
});