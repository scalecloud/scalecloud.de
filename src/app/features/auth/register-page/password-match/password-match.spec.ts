import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, beforeEach, it, expect } from 'vitest';

import { PasswordMatch } from './password-match';

describe('PasswordMatch', () => {
  let component: PasswordMatch;
  let fixture: ComponentFixture<PasswordMatch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordMatch],
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordMatch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should report not matching when both inputs are unset', () => {
    expect(component.isMatching()).toBe(false);
  });

  it('should report not matching when only password is set', () => {
    fixture.componentRef.setInput('password', 'secret123');
    expect(component.isMatching()).toBe(false);
  });

  it('should report not matching when only confirmPassword is set', () => {
    fixture.componentRef.setInput('confirmPassword', 'secret123');
    expect(component.isMatching()).toBe(false);
  });

  it('should report not matching when both are set but empty', () => {
    fixture.componentRef.setInput('password', '');
    fixture.componentRef.setInput('confirmPassword', '');
    expect(component.isMatching()).toBe(false);
  });

  it('should report not matching when the values differ', () => {
    fixture.componentRef.setInput('password', 'secret123');
    fixture.componentRef.setInput('confirmPassword', 'different123');
    expect(component.isMatching()).toBe(false);
  });

  it('should report matching when both non-empty values are equal', () => {
    fixture.componentRef.setInput('password', 'secret123');
    fixture.componentRef.setInput('confirmPassword', 'secret123');
    expect(component.isMatching()).toBe(true);
  });

  it('should update reactively as confirmPassword changes to match', () => {
    fixture.componentRef.setInput('password', 'secret123');
    fixture.componentRef.setInput('confirmPassword', 'wrong');
    expect(component.isMatching()).toBe(false);

    fixture.componentRef.setInput('confirmPassword', 'secret123');
    expect(component.isMatching()).toBe(true);
  });

  it('should expose the matching message', () => {
    expect(component.getMessageMatching()).toBe('Passwords must match.');
  });
});