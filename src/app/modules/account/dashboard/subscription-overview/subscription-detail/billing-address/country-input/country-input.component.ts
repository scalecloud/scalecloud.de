import { Component, ChangeDetectionStrategy, inject, input, effect, signal, output } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { Country } from '../country/countries';
import { CountryService } from '../country/country.service';
import { LanguageService } from '../country/language.service';
import { Language } from '../country/Language';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatAutocompleteTrigger, MatAutocomplete, MatOption } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-country-input',
  templateUrl: './country-input.component.html',
  styleUrl: './country-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    MatAutocompleteTrigger,
    ReactiveFormsModule,
    MatAutocomplete,
    MatOption,
    MatError,
    AsyncPipe,
  ],
})
export class CountryInputComponent {
  private readonly countryService = inject(CountryService);
  private readonly languageService = inject(LanguageService);

  /**
   * Converted from @Input() to a signal input. This matters
   * functionally, not just stylistically: the previous @Input() was
   * only read once, inside ngOnInit. When the parent loads its
   * initial country code asynchronously (e.g. after an HTTP call
   * resolves), the binding's *value* would update, but nothing in
   * this component re-ran to pick it up — ngOnInit had already
   * fired with the empty default. The effect() below re-syncs the
   * control every time this input actually changes, fixing that
   * race.
   */
  readonly initialCountryCode = input<string>('');

  readonly countryControlEmitter = output<FormControl<string>>();

  // `nonNullable` so the control's value type is `string`, not
  // `string | null` — this is what lets getSelectedCountryCode() and
  // the parent's onCountryControlReceived() be typed as plain
  // `string` instead of `string | null` throughout.
  readonly countryControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  filteredCountries: Observable<Country[]> = this.countryControl.valueChanges.pipe(
    startWith(''),
    map((value) => this._filter(value)),
  );

  // Tracks whether the initial code has already been applied, so we
  // don't clobber the user's own typing if initialCountryCode somehow
  // changes again after they've started editing.
  private readonly initialValueApplied = signal(false);

  constructor() {
    effect(() => {
      const code = this.initialCountryCode();
      if (!code || this.initialValueApplied()) {
        return;
      }

      const initialCountry = this.countryService.getCountry(this.languageService.getLanguage(), code);
      if (initialCountry) {
        this.countryControl.setValue(initialCountry);
        this.initialValueApplied.set(true);
      }
    });

    // Emitted once, synchronously, on construction — setControl() in
    // the parent always replaces the *same* control instance with
    // setValue() calls happening on it later, so a single emit here
    // is sufficient; re-emitting on every value change is not needed.
    this.countryControlEmitter.emit(this.countryControl);
  }

  private _filter(value: string): Country[] {
    const filterValue = value.toLowerCase();
    return this.countryService
      .getCountries()
      .filter(
        (country) =>
          country.nameEN.toLowerCase().includes(filterValue) || country.nameDE.toLowerCase().includes(filterValue),
      );
  }

  onCountrySelected(countryName: string) {
    this.countryControl.setValue(countryName);
  }

  getCountryName(country: Country): string {
    return this.languageService.getLanguage() === Language.EN ? country.nameEN : country.nameDE;
  }

  /**
   * Fixed: previously declared to return `string` but
   * CountryService.getCountryCode() returns `string | undefined`,
   * which would fail under strict null checks. Also previously
   * unused anywhere in the codebase — kept since it's a reasonable
   * public API for a parent that wants the code rather than the
   * emitted control's raw (display-name) value, but flagging that
   * dead-code status in case it should be removed instead.
   */
  getSelectedCountryCode(): string | undefined {
    return this.countryService.getCountryCode(this.languageService.getLanguage(), this.countryControl.value);
  }

  validateCountry() {
    const countryName = this.countryControl.value;

    if (!countryName) {
      this.countryControl.setErrors({ required: true });
      return;
    }

    const countryCode = this.countryService.getCountryCode(this.languageService.getLanguage(), countryName);
    if (!countryCode) {
      this.countryControl.setErrors({ invalidCountry: true });
    } else {
      this.countryControl.setErrors(null);
    }
  }
}