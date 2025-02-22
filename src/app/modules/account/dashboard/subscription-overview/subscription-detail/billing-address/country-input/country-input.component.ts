import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { Country } from '../country/countries';
import { CountryService } from '../country/country.service';
import { LanguageService } from '../country/language.service';
import { Language } from '../country/Language';

@Component({
    selector: 'app-country-input',
    templateUrl: './country-input.component.html',
    styleUrl: './country-input.component.scss',
    standalone: false
})
export class CountryInputComponent implements OnInit {

  @Input() initialCountryCode: string = '';
  @Output() countryControlEmitter = new EventEmitter<FormControl>();

  countryControl = new FormControl('', [Validators.required]);
  filteredCountries: Observable<Country[]>;

  constructor(
    private readonly countryService: CountryService,
    private readonly languageService: LanguageService
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
      }
    }

    this.countryControlEmitter.emit(this.countryControl);
  }

  private _filter(value: string): Country[] {
    const filterValue = value.toLowerCase();
    return this.countryService.getCountries().filter(country =>
      country.nameEN.toLowerCase().includes(filterValue) ||
      country.nameDE.toLowerCase().includes(filterValue)
    );
  }

  onCountrySelected(countryName: string) {
    this.countryControl.setValue(countryName);
  }

  getCountryName(country: Country): string {
    return this.languageService.getLanguage() === Language.EN ? country.nameEN : country.nameDE;
  }

  getSelectedCountryCode(): string {
    return this.countryService.getCountryCode(this.languageService.getLanguage(), this.countryControl.value);
  }

  validateCountry() {
    const countryName = this.countryControl.value;

    if (!countryName) {
      this.countryControl.setErrors({ required: true });
    } else {
      const countryCode = this.countryService.getCountryCode(this.languageService.getLanguage(), countryName);
      if (!countryCode) {
        this.countryControl.setErrors({ invalidCountry: true });
      } else {
        this.countryControl.setErrors(null);
      }
    }
  }
}
