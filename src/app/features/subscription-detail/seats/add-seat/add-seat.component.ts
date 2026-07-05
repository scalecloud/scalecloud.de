import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AddSeatRequest } from '../seats';
import { SnackBarService } from 'src/app/core/snackbar/snack-bar.service';
import { AddSeatService } from './add-seat.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { RoleDescriptions, Role } from 'src/app/core/permission/roles';
import { firstValueFrom } from 'rxjs';
import { MatCard, MatCardTitle, MatCardContent } from '@angular/material/card';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatChipListbox, MatChipOption } from '@angular/material/chips';
import { MatTooltip } from '@angular/material/tooltip';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ReturnUrlService } from 'src/app/core/redirect/return-url.service';
import { Auth } from 'src/app/core/auth/auth';
import { Log } from 'src/app/core/logging/log';

@Component({
  selector: 'app-add-seat',
  templateUrl: './add-seat.component.html',
  styleUrl: './add-seat.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatCard, MatCardTitle, MatCardContent,
    MatFormField, MatLabel, MatInput, MatError,
    MatChipListbox, MatChipOption,
    MatTooltip,
    MatButton,
    MatProgressSpinner,
  ],
})
export class AddSeatComponent {
  private readonly auth = inject(Auth);
  private readonly log = inject(Log);
  private readonly snackBarService = inject(SnackBarService);
  private readonly addSeatService = inject(AddSeatService);
  private readonly returnUrlService = inject(ReturnUrlService);
  private readonly route = inject(ActivatedRoute);

  readonly email = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });

  /** All roles available for invitation. Owner is excluded — it cannot be assigned. */
  readonly inviteUserRoles: Role[] = Object.values(Role).filter(
    (role) => role !== Role.Owner,
  );

  readonly roleDescriptions = RoleDescriptions;

  readonly selectedRoles = signal<Role[]>([]);
  readonly isSubmitting = signal(false);

  private readonly emailStatus = toSignal(this.email.statusChanges, {
    initialValue: this.email.status,
  });

  readonly isEmailInvalid = computed(() => this.emailStatus() !== 'VALID');

  async addSeat(): Promise<void> {
    if (this.email.invalid) {
      this.log.warn('Invalid email on invite attempt.');
      this.email.markAsTouched();
      return;
    }

    const subscriptionID = this.route.snapshot.paramMap.get('subscriptionID');

    if (!subscriptionID) {
      this.snackBarService.error(
        'Currently not possible to invite a user. Please try again later.',
      );
      this.returnUrlService.openReturnURL('/dashboard');
      return;
    }

    this.isSubmitting.set(true);

    const addSeatRequest: AddSeatRequest = {
      subscriptionID,
      email: this.email.value,
      roles: this.selectedRoles(),
    };

    try {
      await this.auth.waitForAuth();
    } catch (error) {
      this.isSubmitting.set(false);
      this.log.error('waitForAuth failed: ' + error);
      return;
    }

    try {
      const reply = await firstValueFrom(
        this.addSeatService.addSeat(addSeatRequest),
      );

      if (reply.success) {
        this.snackBarService.info(`Invitation sent to ${reply.email}.`);
        this.returnUrlService.openReturnURL('/dashboard');
      } else {
        this.snackBarService.error(
          `Could not send invitation to ${reply.email}. Please retry.`,
        );
      }
    } catch (err) {
      this.log.error('addSeat request failed: ' + err);
      this.snackBarService.error('An unexpected error occurred. Please try again.');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  getEmailErrorMessage(): string {
    if (this.email.hasError('required')) {
      return 'E-mail address is required';
    }
    return this.email.hasError('email') ? 'Enter a valid e-mail address' : '';
  }

  toggleRoleSelection(role: Role): void {
    this.selectedRoles.update((roles) => {
      const index = roles.indexOf(role);
      return index === -1
        ? [...roles, role]
        : roles.filter((_, i) => i !== index);
    });
  }

  handleKeyDown(event: KeyboardEvent, role: Role): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleRoleSelection(role);
    }
  }
}