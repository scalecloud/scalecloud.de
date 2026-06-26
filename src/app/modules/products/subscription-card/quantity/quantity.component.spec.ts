import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuantityComponent } from './quantity.component';
import { describe, beforeEach, it, expect } from 'vitest';

describe('QuantityComponent', () => {
  let component: QuantityComponent;
  let fixture: ComponentFixture<QuantityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [QuantityComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(QuantityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
