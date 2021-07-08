import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SynologyComponent } from './synology.component';

describe('SynologyComponent', () => {
  let component: SynologyComponent;
  let fixture: ComponentFixture<SynologyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SynologyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SynologyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
