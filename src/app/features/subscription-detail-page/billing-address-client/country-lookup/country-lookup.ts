import { Injectable, inject } from '@angular/core';
import { countries, Country } from './countries';
import { Log } from 'src/app/core/logging/log';
import { Language } from './language-model';

@Injectable({
  providedIn: 'root'
})
export class CountryLookup {
  private readonly log = inject(Log);

  getCountry(language: Language, code: string): string {
    const country = countries.find(c => c.code === code);
    if (!country) {
      this.log.warn(`Country with code "${code}" not found`);
      return code;
    }
    return language === Language.EN ? country.nameEN : country.nameDE;
  }

  getCountryCode(language: Language, name: string): string | undefined {
    const country = language === Language.EN
      ? countries.find(c => c.nameEN === name)
      : countries.find(c => c.nameDE === name);

    if (!country) {
      this.log.error(`Country with name ${name} not found`);
      return undefined;
    }
    return country.code;
  }

  getCountries(): Country[] {
    return countries;
  }

}
