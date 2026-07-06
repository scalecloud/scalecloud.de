import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDivider } from '@angular/material/divider';
import { describe, beforeEach, it, expect } from 'vitest';
import { TitleCard } from './title-card';

describe('TitelCardComponent', () => {
  let component: TitleCard;
  let fixture: ComponentFixture<TitleCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TitleCard,
        MatDivider]
})
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TitleCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
