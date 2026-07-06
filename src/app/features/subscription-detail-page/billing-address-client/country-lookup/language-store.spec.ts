import { TestBed } from '@angular/core/testing';
import { describe, beforeEach, it, expect } from 'vitest';
import { firstValueFrom, take, toArray } from 'rxjs';
import { LanguageStore } from './language-store';
import { Language } from './language-model';

describe('LanguageStore', () => {
  let service: LanguageStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LanguageStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should default to English', () => {
    expect(service.getLanguage()).toBe(Language.EN);
  });

  it('should emit the default language immediately to new subscribers', async () => {
    const value = await firstValueFrom(service.language$);
    expect(value).toBe(Language.EN);
  });

  it('should update the synchronous getter after setLanguage is called', () => {
    service.setLanguage(Language.DE);
    expect(service.getLanguage()).toBe(Language.DE);
  });

  it('should emit the new language on language$ after setLanguage is called', async () => {
    const emissions = firstValueFrom(service.language$.pipe(take(2), toArray()));

    service.setLanguage(Language.DE);

    expect(await emissions).toEqual([Language.EN, Language.DE]);
  });

  it('should allow switching back and forth between languages', () => {
    service.setLanguage(Language.DE);
    expect(service.getLanguage()).toBe(Language.DE);

    service.setLanguage(Language.EN);
    expect(service.getLanguage()).toBe(Language.EN);
  });
});