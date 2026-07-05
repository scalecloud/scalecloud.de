import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, beforeEach, it, expect } from 'vitest';

import { PasswordStrength } from './password-strength';

describe('PasswordStrength', () => {
  let component: PasswordStrength;
  let fixture: ComponentFixture<PasswordStrength>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordStrength],
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordStrength);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ─── Default (no input set) ────────────────────────────────────────────────

  it('should treat an unset password as failing every check', () => {
    expect(component.containsLower()).toBe(false);
    expect(component.containsUpper()).toBe(false);
    expect(component.containsDigit()).toBe(false);
    expect(component.containsSpecial()).toBe(false);
    expect(component.isLength()).toBe(false);
    expect(component.isPasswordStrength()).toBe(false);
  });

  // ─── containsLower ───────────────────────────────────────────────────────────

  it('should detect a lowercase character', () => {
    fixture.componentRef.setInput('password', 'a');
    expect(component.containsLower()).toBe(true);
  });

  it('should report no lowercase character when there is none', () => {
    fixture.componentRef.setInput('password', 'ABC123!');
    expect(component.containsLower()).toBe(false);
  });

  // ─── containsUpper ───────────────────────────────────────────────────────────

  it('should detect an uppercase character', () => {
    fixture.componentRef.setInput('password', 'A');
    expect(component.containsUpper()).toBe(true);
  });

  it('should report no uppercase character when there is none', () => {
    fixture.componentRef.setInput('password', 'abc123!');
    expect(component.containsUpper()).toBe(false);
  });

  // ─── containsDigit ───────────────────────────────────────────────────────────

  it('should detect a digit', () => {
    fixture.componentRef.setInput('password', '1');
    expect(component.containsDigit()).toBe(true);
  });

  it('should report no digit when there is none', () => {
    fixture.componentRef.setInput('password', 'abcABC!');
    expect(component.containsDigit()).toBe(false);
  });

  // ─── containsSpecial ─────────────────────────────────────────────────────────

  it('should detect a special character', () => {
    fixture.componentRef.setInput('password', '!');
    expect(component.containsSpecial()).toBe(true);
  });

  it('should detect an underscore as a special character', () => {
    fixture.componentRef.setInput('password', '_');
    expect(component.containsSpecial()).toBe(true);
  });

  it('should report no special character when there is none', () => {
    fixture.componentRef.setInput('password', 'abcABC123');
    expect(component.containsSpecial()).toBe(false);
  });

  // ─── isLength ────────────────────────────────────────────────────────────────

  it('should report false for fewer than 8 characters', () => {
    fixture.componentRef.setInput('password', 'Abc123!');
    expect(component.isLength()).toBe(false);
  });

  it('should report true for exactly 8 characters', () => {
    fixture.componentRef.setInput('password', 'Abcd123!');
    expect(component.isLength()).toBe(true);
  });

  it('should report true for more than 8 characters', () => {
    fixture.componentRef.setInput('password', 'Abcdefgh123!');
    expect(component.isLength()).toBe(true);
  });

  // ─── isPasswordStrength ──────────────────────────────────────────────────────

  it('should report strong for a password meeting all criteria', () => {
    fixture.componentRef.setInput('password', 'Abcdefg1!');
    expect(component.isPasswordStrength()).toBe(true);
  });

  it('should report weak when missing only the special character', () => {
    fixture.componentRef.setInput('password', 'Abcdefg1');
    expect(component.isPasswordStrength()).toBe(false);
  });

  it('should report weak when missing only the digit', () => {
    fixture.componentRef.setInput('password', 'Abcdefgh!');
    expect(component.isPasswordStrength()).toBe(false);
  });

  it('should report weak when missing only the uppercase character', () => {
    fixture.componentRef.setInput('password', 'abcdefg1!');
    expect(component.isPasswordStrength()).toBe(false);
  });

  it('should report weak when missing only the lowercase character', () => {
    fixture.componentRef.setInput('password', 'ABCDEFG1!');
    expect(component.isPasswordStrength()).toBe(false);
  });

  it('should report weak when too short despite meeting all character classes', () => {
    fixture.componentRef.setInput('password', 'Ab1!');
    expect(component.isPasswordStrength()).toBe(false);
  });

  // ─── checks (template-facing) ────────────────────────────────────────────────

  it('should expose five checks', () => {
    expect(component.checks().length).toBe(5);
  });

  it('should mark all checks as passed for a strong password', () => {
    fixture.componentRef.setInput('password', 'Abcdefg1!');
    expect(component.checks().every((check) => check.passed)).toBe(true);
  });

  it('should mark all checks as failed for an empty password', () => {
    fixture.componentRef.setInput('password', '');
    expect(component.checks().every((check) => !check.passed)).toBe(true);
  });

  it('should update reactively when the password input changes', async () => {
    fixture.componentRef.setInput('password', 'weak');
    expect(component.isPasswordStrength()).toBe(false);

    fixture.componentRef.setInput('password', 'Strong1!');
    expect(component.isPasswordStrength()).toBe(true);
  });
});