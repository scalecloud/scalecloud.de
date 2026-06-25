import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveComponent } from './active.component';
import { describe, beforeEach, it, expect } from 'vitest';

describe('ActiveComponent', () => {
  let component: ActiveComponent;
  let fixture: ComponentFixture<ActiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
