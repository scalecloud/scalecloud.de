import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';

import { CountryInputComponent } from './country-input.component';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { CountryService } from '../country/country.service';
import { LanguageService } from '../country/language.service';
import { Language } from '../country/Language';

describe('CountryInputComponent', () => {
  let component: CountryInputComponent;
  let fixture: ComponentFixture<CountryInputComponent>;

  const countryServiceMock = {
    getCountry: vi.fn().mockReturnValue('Germany'),
    getCountries: vi.fn().mockReturnValue([
      { nameEN: 'Germany', nameDE: 'Deutschland', code: 'DE' },
      { nameEN: 'France', nameDE: 'Frankreich', code: 'FR' }
    ]),
    getCountryCode: vi.fn().mockReturnValue('DE')
  };
  const languageServiceMock = { getLanguage: vi.fn().mockReturnValue(Language.EN) };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        MatOptionModule,
        CountryInputComponent
    ],
    providers: [
        { provide: CountryService, useValue: countryServiceMock },
        { provide: LanguageService, useValue: languageServiceMock }
    ]
}).compileComponents();

    fixture = TestBed.createComponent(CountryInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
