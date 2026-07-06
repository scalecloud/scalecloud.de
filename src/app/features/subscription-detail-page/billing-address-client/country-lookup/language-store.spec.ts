import { TestBed } from '@angular/core/testing';
import { describe, beforeEach, it, expect } from 'vitest';
import { firstValueFrom, take, toArray } from 'rxjs';
import { LanguageStore } from './language-store';
import { Language } from './language-model';

describe('LanguageStore', () => {
  let languageStore: LanguageStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    languageStore = TestBed.inject(LanguageStore);
  });

  it('should be created', () => {
    expect(languageStore).toBeTruthy();
  });

  it('should default to English', () => {
    expect(languageStore.getLanguage()).toBe(Language.EN);
  });

  it('should emit the default language immediately to new subscribers', async () => {
    const value = await firstValueFrom(languageStore.language$);
    expect(value).toBe(Language.EN);
  });

  it('should update the synchronous getter after setLanguage is called', () => {
    languageStore.setLanguage(Language.DE);
    expect(languageStore.getLanguage()).toBe(Language.DE);
  });

  it('should emit the new language on language$ after setLanguage is called', async () => {
    const emissions = firstValueFrom(languageStore.language$.pipe(take(2), toArray()));

    languageStore.setLanguage(Language.DE);

    expect(await emissions).toEqual([Language.EN, Language.DE]);
  });

  it('should allow switching back and forth between languages', () => {
    languageStore.setLanguage(Language.DE);
    expect(languageStore.getLanguage()).toBe(Language.DE);

    languageStore.setLanguage(Language.EN);
    expect(languageStore.getLanguage()).toBe(Language.EN);
  });
});