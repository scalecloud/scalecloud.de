import { Injectable, inject } from '@angular/core';
import { LogService } from 'src/app/core/logging/log.service';
import { countries, Country } from './countries';
import { Language } from './Language';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private readonly logService = inject(LogService);

  getCountry(language: Language, code: string): string {
    const country = countries.find(c => c.code === code);
    if (!country) {
      this.logService.warn(`Country with code "${code}" not found`);
      return code;
    }
    return language === Language.EN ? country.nameEN : country.nameDE;
  }

  getCountryCode(language: Language, name: string): string | undefined {
    const country = language === Language.EN
      ? countries.find(c => c.nameEN === name)
      : countries.find(c => c.nameDE === name);

    if (!country) {
      this.logService.error(`Country with name ${name} not found`);
      return undefined;
    }
    return country.code;
  }

  getCountries(): Country[] {
    return countries;
  }

}
