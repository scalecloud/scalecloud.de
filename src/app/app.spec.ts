import { RouterModule } from '@angular/router';
import { TestBed } from '@angular/core/testing';

import { App } from './app';
import { describe, beforeEach, it, expect } from 'vitest';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [
    App,
    RouterModule
]
}).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'scalecloud'`, () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('scalecloud');
  });

});
