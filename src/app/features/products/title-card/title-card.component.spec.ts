import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDivider } from '@angular/material/divider';
import { describe, beforeEach, it, expect } from 'vitest';
import { TitleCardComponent } from './title-card.component';

describe('TitelCardComponent', () => {
  let component: TitleCardComponent;
  let fixture: ComponentFixture<TitleCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TitleCardComponent,
        MatDivider]
})
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TitleCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
