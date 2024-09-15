import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelStateComponent } from './cancel-state.component';

describe('CancelStateComponent', () => {
  let component: CancelStateComponent;
  let fixture: ComponentFixture<CancelStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancelStateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
