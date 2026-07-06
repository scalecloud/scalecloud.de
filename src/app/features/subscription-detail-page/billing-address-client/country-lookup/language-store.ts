import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Language } from './language-model';

@Injectable({
  providedIn: 'root'
})
export class LanguageStore {

  private readonly languageSubject = new BehaviorSubject<Language>(Language.EN);
  language$ = this.languageSubject.asObservable();

  setLanguage(language: Language) {
    this.languageSubject.next(language);
  }

  getLanguage(): Language {
    return this.languageSubject.value;
  }

}
