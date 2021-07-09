import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitelCardComponent } from './titel-card.component';

describe('TitelCardComponent', () => {
  let component: TitelCardComponent;
  let fixture: ComponentFixture<TitelCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TitelCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TitelCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
