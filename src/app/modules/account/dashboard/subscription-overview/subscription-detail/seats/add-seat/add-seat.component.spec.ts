import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSeatComponent } from './add-seat.component';

describe('AddSeatComponent', () => {
  let component: AddSeatComponent;
  let fixture: ComponentFixture<AddSeatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSeatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddSeatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
