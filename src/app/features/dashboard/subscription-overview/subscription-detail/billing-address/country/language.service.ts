import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Language } from './Language';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private readonly languageSubject = new BehaviorSubject<Language>(Language.EN);
  language$ = this.languageSubject.asObservable();

  setLanguage(language: Language) {
    this.languageSubject.next(language);
  }

  getLanguage(): Language {
    return this.languageSubject.value;
  }

}
