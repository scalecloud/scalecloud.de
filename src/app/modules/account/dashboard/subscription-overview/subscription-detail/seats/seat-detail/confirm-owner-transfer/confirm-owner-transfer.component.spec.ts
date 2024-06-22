import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmOwnerTransferComponent } from './confirm-owner-transfer.component';

describe('ConfirmOwnerTransferComponent', () => {
  let component: ConfirmOwnerTransferComponent;
  let fixture: ComponentFixture<ConfirmOwnerTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmOwnerTransferComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmOwnerTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
