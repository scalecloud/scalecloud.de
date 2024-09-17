import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackBarProgressComponent } from './snack-bar-progress.component';

describe('SnackBarProgressComponent', () => {
  let component: SnackBarProgressComponent;
  let fixture: ComponentFixture<SnackBarProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SnackBarProgressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SnackBarProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
