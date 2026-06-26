import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDividerModule } from '@angular/material/divider';

import { ImprintComponent } from './imprint.component';
import { describe, beforeEach, it, expect } from 'vitest';

describe('ImprintComponent', () => {
  let component: ImprintComponent;
  let fixture: ComponentFixture<ImprintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RouterTestingModule, MatDividerModule, ImprintComponent]
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
