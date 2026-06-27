import { RouterModule } from '@angular/router';
import { TestBed } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { describe, beforeEach, it, expect } from 'vitest';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [
    AppComponent,
    RouterModule
]
}).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'scalecloud'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('scalecloud');
  });

});
