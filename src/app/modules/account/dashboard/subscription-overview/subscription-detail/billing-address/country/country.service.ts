import { Injectable } from '@angular/core';
import { LogService } from 'src/app/shared/services/log/log.service';
import { countries } from '../country-input/countries';
import { Language } from './Language';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor(
    private logService: LogService
  ) { }

  getCountry(language: Language, code: string): string {
    let country = '';
    if (!code) {
      this.logService.error('Country code is null');
    } else {
      const countrySearch = countries.find(c => c.code === code);
      if (!country) {
        this.logService.error(`Country with code ${code} not found`);
        country = code;
      }
      if (language === Language.EN) {
        country = countrySearch.nameEN;
      } else {
        country = countrySearch.nameDE;
      }
    }
    return country;
  }

  getCountryCode(language: Language, name: string): string {
    let countryCode = '';
    if (!name) {
      this.logService.error('Country name is null');
    } else {
      let countrySearch;
      if (language === Language.EN) {
        countrySearch = countries.find(c => c.nameEN === name);
      } else {
        countrySearch = countries.find(c => c.nameDE === name);
      }
      if (!countrySearch) {
        this.logService.error(`Country with name ${name} not found`);
        countryCode = name;
      } else {
        countryCode = countrySearch.code;
      }
    }
    return countryCode;
  }

  getCountries() {
    return countries;
  }

}
