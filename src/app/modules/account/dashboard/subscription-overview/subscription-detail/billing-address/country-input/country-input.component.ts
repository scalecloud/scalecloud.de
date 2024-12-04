import { Component, effect, inject, Input, OnInit, signal, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Observable, startWith, map } from 'rxjs';
import { _filter, countriesDE } from './countries';


@Component({
  selector: 'app-country-input',
  templateUrl: './country-input.component.html',
  styleUrl: './country-input.component.scss'
})
export class CountryInputComponent implements OnInit {

  @Input() initialCountry: string = '';
  @Input() disableInput: boolean = true;

  private _formBuilder = inject(FormBuilder);

  countryControl = new FormControl();
  filteredCountries: Observable<{ code: string, name: string }[]>;

  selectedCountry: { code: string, name: string } | null = null;

  ngOnInit() {
    if (this.initialCountry) {
      const initialCountryObj = countriesDE.find(country => country.code === this.initialCountry);
      if (initialCountryObj) {
        this.countryControl.setValue(initialCountryObj.name);
        this.selectedCountry = initialCountryObj;
      }
    }

    this.filteredCountries = this.countryControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCountries(value || '')),
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['disableInput']) {
      if (this.disableInput) {
        this.countryControl.disable();
      } else {
        this.countryControl.enable();
      }
    }
  }

  private _filterCountries(value: string): { code: string, name: string }[] {
    const filterValue = value.toLowerCase();
    return countriesDE.filter(country => country.name.toLowerCase().includes(filterValue));
  }

  onCountrySelected(countryName: string) {
    this.selectedCountry = countriesDE.find(country => country.name === countryName) || null;
    console.log('Selected country:', this.selectedCountry);
  }
}
