import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDivider } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { HomeComponent } from './home.component';
import { describe, beforeEach, it, expect } from 'vitest';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [
        MatListModule,
        HomeComponent,
        MatDivider
    ],
},

    )
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('ScaleCloud.de');
  });
  
});
