import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIcon } from '@angular/material/icon';
import { MatMenu } from '@angular/material/menu';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';

import { HeaderComponent } from './header.component';
import { describe, beforeEach, it, expect } from 'vitest';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [HeaderComponent,
        MatMenu,
        MatToolbar,
        MatToolbarRow,
        MatIcon],
})
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
