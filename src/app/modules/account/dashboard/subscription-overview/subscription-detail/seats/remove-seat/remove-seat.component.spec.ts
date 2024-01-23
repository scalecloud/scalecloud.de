import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveSeatComponent } from './remove-seat.component';

describe('RemoveSeatComponent', () => {
  let component: RemoveSeatComponent;
  let fixture: ComponentFixture<RemoveSeatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoveSeatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RemoveSeatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
