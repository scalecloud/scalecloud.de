import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingFailedComponent } from './loading-failed.component';

describe('LoadingFailedComponent', () => {
  let component: LoadingFailedComponent;
  let fixture: ComponentFixture<LoadingFailedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingFailedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingFailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
