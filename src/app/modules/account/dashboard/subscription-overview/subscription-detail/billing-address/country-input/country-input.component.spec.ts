import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { firstValueFrom } from 'rxjs';

import { CountryInputComponent } from './country-input.component';
import { describe, beforeEach, it, expect, vi, type Mock } from 'vitest';
import { CountryService } from '../country/country.service';
import { LanguageService } from '../country/language.service';
import { Language } from '../country/Language';

describe('CountryInputComponent', () => {
  let component: CountryInputComponent;
  let fixture: ComponentFixture<CountryInputComponent>;
  let countryServiceMock: {
    getCountry: Mock;
    getCountries: Mock;
    getCountryCode: Mock;
  };
  let languageServiceMock: { getLanguage: Mock };

  const COUNTRY_LIST = [
    { nameEN: 'Germany', nameDE: 'Deutschland', code: 'DE' },
    { nameEN: 'France', nameDE: 'Frankreich', code: 'FR' },
  ];

  /**
   * Re-creates TestBed so tests can set `initialCountryCode` before
   * the first change detection runs (Angular only runs the
   * constructor + effects once detectChanges fires for an input
   * component under test).
   */
  async function createComponent() {
    countryServiceMock = {
      getCountry: vi.fn().mockReturnValue('Germany'),
      getCountries: vi.fn().mockReturnValue(COUNTRY_LIST),
      getCountryCode: vi.fn().mockReturnValue('DE'),
    };
    languageServiceMock = { getLanguage: vi.fn().mockReturnValue(Language.EN) };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        MatOptionModule,
        CountryInputComponent,
      ],
      providers: [
        { provide: CountryService, useValue: countryServiceMock },
        { provide: LanguageService, useValue: languageServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CountryInputComponent);
    component = fixture.componentInstance;
  }

  beforeEach(async () => {
    await createComponent();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with an empty, required country control', () => {
    expect(component.countryControl.value).toBe('');
    expect(component.countryControl.hasError('required')).toBe(true);
  });

  it('should emit the same control instance that the parent will bind to', async () => {
    // Output emissions during construction happen before a manually
    // attached `.subscribe()` call in a test could exist (real
    // @Output() template bindings are wired up by Angular before the
    // component's constructor body runs, which a host component
    // reproduces faithfully). Using a tiny host component with a
    // real template binding, rather than spying or subscribing late,
    // is the standard way to observe this correctly.
    @Component({
      template: `<app-country-input (countryControlEmitter)="onEmit($event)" />`,
      imports: [CountryInputComponent],
    })
    class HostComponent {
      emitted?: FormControl<string>;
      onEmit(control: FormControl<string>) {
        this.emitted = control;
      }
    }

    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [
        { provide: CountryService, useValue: countryServiceMock },
        { provide: LanguageService, useValue: languageServiceMock },
      ],
    }).compileComponents();

    const hostFixture = TestBed.createComponent(HostComponent);
    hostFixture.detectChanges();

    const childDebugEl = hostFixture.debugElement.children[0];
    const childComponent: CountryInputComponent = childDebugEl.componentInstance;

    expect(hostFixture.componentInstance.emitted).toBe(childComponent.countryControl);
  });

  describe('filteredCountries', () => {
    it('should include all countries when the input is empty', async () => {
      const result = await firstValueFrom(component.filteredCountries);
      expect(result).toEqual(COUNTRY_LIST);
    });

    it('should filter by English name', async () => {
      component.countryControl.setValue('ger');
      const result = await firstValueFrom(component.filteredCountries);
      expect(result).toEqual([COUNTRY_LIST[0]]);
    });

    it('should filter by German name', async () => {
      component.countryControl.setValue('frank');
      const result = await firstValueFrom(component.filteredCountries);
      expect(result).toEqual([COUNTRY_LIST[1]]);
    });

    it('should be case-insensitive', async () => {
      component.countryControl.setValue('GERMANY');
      const result = await firstValueFrom(component.filteredCountries);
      expect(result).toEqual([COUNTRY_LIST[0]]);
    });

    it('should return an empty list when nothing matches', async () => {
      component.countryControl.setValue('doesnotexist');
      const result = await firstValueFrom(component.filteredCountries);
      expect(result).toEqual([]);
    });
  });

  describe('getCountryName', () => {
    it('should return the English name when language is EN', () => {
      expect(component.getCountryName(COUNTRY_LIST[0])).toBe('Germany');
    });

    it('should return the German name when language is DE', () => {
      languageServiceMock.getLanguage.mockReturnValue(Language.DE);
      expect(component.getCountryName(COUNTRY_LIST[0])).toBe('Deutschland');
    });
  });

  describe('onCountrySelected', () => {
    it('should set the control value to the selected country name', () => {
      component.onCountrySelected('France');
      expect(component.countryControl.value).toBe('France');
    });
  });

  describe('validateCountry', () => {
    it('should set a required error when the control is empty', () => {
      component.countryControl.setValue('');
      component.validateCountry();
      expect(component.countryControl.hasError('required')).toBe(true);
    });

    it('should set an invalidCountry error when the name does not resolve to a code', () => {
      countryServiceMock.getCountryCode.mockReturnValue(undefined);
      component.countryControl.setValue('Not A Country');

      component.validateCountry();

      expect(component.countryControl.hasError('invalidCountry')).toBe(true);
    });

    it('should clear errors when the name resolves to a valid code', () => {
      countryServiceMock.getCountryCode.mockReturnValue('DE');
      component.countryControl.setValue('Germany');

      component.validateCountry();

      expect(component.countryControl.errors).toBeNull();
    });
  });

  describe('getSelectedCountryCode', () => {
    it('should delegate to CountryService with the current language and value', () => {
      component.countryControl.setValue('Germany');

      const result = component.getSelectedCountryCode();

      expect(countryServiceMock.getCountryCode).toHaveBeenCalledWith(Language.EN, 'Germany');
      expect(result).toBe('DE');
    });

    it('should return undefined when the service cannot resolve a code', () => {
      countryServiceMock.getCountryCode.mockReturnValue(undefined);
      component.countryControl.setValue('Nowhere');

      expect(component.getSelectedCountryCode()).toBeUndefined();
    });
  });

  describe('initialCountryCode', () => {
    it('should leave the control empty when no initial code is provided', async () => {
      await createComponent();
      fixture.detectChanges();

      expect(component.countryControl.value).toBe('');
    });

    it('should pre-fill the control when initialCountryCode is set before the first render', async () => {
      await createComponent();
      fixture.componentRef.setInput('initialCountryCode', 'DE');

      fixture.detectChanges();

      expect(countryServiceMock.getCountry).toHaveBeenCalledWith(Language.EN, 'DE');
      expect(component.countryControl.value).toBe('Germany');
    });

    it('should pre-fill the control when initialCountryCode arrives asynchronously after creation', async () => {
      // This is the regression test for the bug in the original
      // ngOnInit-based implementation: initialCountryCode was only
      // ever read once, so a parent that loads its data via an
      // HTTP call (and updates the binding *after* the child has
      // already initialized) would never see its value applied.
      // The effect()-based implementation must re-run when the
      // input changes, no matter how late.
      await createComponent();
      fixture.detectChanges(); // first render, no code yet
      expect(component.countryControl.value).toBe('');

      fixture.componentRef.setInput('initialCountryCode', 'DE');
      fixture.detectChanges(); // simulates the parent's async patch resolving later

      expect(component.countryControl.value).toBe('Germany');
    });

    it('should not override a value the user has already typed once the initial code has been applied', async () => {
      await createComponent();
      fixture.componentRef.setInput('initialCountryCode', 'DE');
      fixture.detectChanges();
      expect(component.countryControl.value).toBe('Germany');

      component.countryControl.setValue('France');
      fixture.detectChanges();

      expect(component.countryControl.value).toBe('France');
    });

    it('should do nothing when the resolved country name is falsy', async () => {
      countryServiceMock.getCountry.mockReturnValue('');
      await createComponent();
      fixture.componentRef.setInput('initialCountryCode', 'ZZ');

      fixture.detectChanges();

      expect(component.countryControl.value).toBe('');
    });
  });
});