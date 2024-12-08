import { Component, inject, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { _filter, Country } from '../country/countries';
import { CountryService } from '../country/country.service';
import { LanguageService } from '../country/language.service';
import { Language } from '../country/Language';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';


@Component({
  selector: 'app-country-input',
  templateUrl: './country-input.component.html',
  styleUrl: './country-input.component.scss'
})
export class CountryInputComponent implements OnInit {

  @Input() initialCountryCode: string = '';

  countryControl = new FormControl();
  filteredCountries: Observable<Country[]>;

  selectedCountryCode: string;

  constructor(
    private countryService: CountryService,
    private languageService: LanguageService,
    private snackBarService: SnackBarService
  ) { }

  ngOnInit() {
    this.filteredCountries = this.countryControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    if (this.initialCountryCode) {
      const initialCountry = this.countryService.getCountry(this.languageService.getLanguage(), this.initialCountryCode);
      if (initialCountry) {
        this.countryControl.setValue(initialCountry);
        this.selectedCountryCode = this.initialCountryCode;
      }
    }
  }

  private _filter(value: string): Country[] {
    const filterValue = value.toLowerCase();
    return this.countryService.getCountries().filter(country =>
      country.nameEN.toLowerCase().includes(filterValue) ||
      country.nameDE.toLowerCase().includes(filterValue)
    );
  }

  onCountrySelected(countryName: string) {
    this.selectedCountryCode = this.countryService.getCountryCode(this.languageService.getLanguage(), countryName);
  }

  getCountryName(country: Country): string {
    return this.languageService.getLanguage() === Language.EN ? country.nameEN : country.nameDE;
  }

  getSelectedCountryCode(): string {
    return this.selectedCountryCode;
  }

  validateCountry() {
    const countryName = this.countryControl.value;
    const country = this.languageService.getLanguage() === Language.EN
      ? this.countryService.getCountries().find(c => c.nameEN === countryName)
      : this.countryService.getCountries().find(c => c.nameDE === countryName);

    if (!country) {
      this.countryControl.setErrors({ invalidCountry: true });
      this.selectedCountryCode = '';
      this.snackBarService.error('Invalid country');
    } else {
      this.selectedCountryCode = country.code;
    }
  }
}
