import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDivider } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';

import { FooterComponent } from './footer.component';
import { describe, beforeEach, it, expect } from 'vitest';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [
        MatListModule,
        MatSidenavModule,
        FooterComponent,
        MatDivider
    ]
})
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
