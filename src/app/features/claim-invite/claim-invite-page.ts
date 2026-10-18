import { DatePipe, Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardActions, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

import { Auth } from '../../core/auth/auth';
import { InvitationClient } from './invitation-client';
import { InvitationClaimReply, InvitationPreview } from './invitation-model';

const PENDING_INVITATION_KEY = 'scalecloud.invitation.pendingToken';
const CLAIM_ROUTE = '/claim-invite';

type ClaimPageState =
  | 'loading-preview'
  | 'preview-ready'
  | 'preview-unavailable'
  | 'preview-temporary-failure'
  | 'claiming'
  | 'claim-unauthorized'
  | 'claim-forbidden'
  | 'claim-unavailable'
  | 'claim-temporary-failure'
  | 'success';

@Component({
  selector: 'app-claim-invite-page',
  templateUrl: './claim-invite-page.html',
  styleUrl: './claim-invite-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, MatButton, MatCard, MatCardActions, MatCardContent, MatCardTitle, MatIcon, MatProgressBar, MatProgressSpinner],
})
export class ClaimInvitePage implements OnInit {
  readonly auth = inject(Auth);
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly router = inject(Router);
  private readonly invitationClient = inject(InvitationClient);

  readonly state = signal<ClaimPageState>('loading-preview');
  readonly preview = signal<InvitationPreview | null>(null);
  readonly claimReply = signal<InvitationClaimReply | null>(null);
  private token: string | null = null;

  ngOnInit(): void {
    const queryToken = this.route.snapshot.queryParamMap.get('token');
    if (queryToken) {
      this.token = queryToken;
      try {
        sessionStorage.setItem(PENDING_INVITATION_KEY, queryToken);
      } catch {
        this.state.set('preview-temporary-failure');
        return;
      }
      this.location.replaceState(CLAIM_ROUTE);
    } else {
      try {
        this.token = sessionStorage.getItem(PENDING_INVITATION_KEY);
      } catch {
        this.token = null;
      }
    }

    if (!this.token) {
      this.state.set('preview-unavailable');
      return;
    }

    void this.auth.init();
    this.loadPreview();
  }

  loadPreview(): void {
    if (!this.token) {
      this.state.set('preview-unavailable');
      return;
    }

    this.state.set('loading-preview');
    this.invitationClient.preview(this.token).subscribe({
      next: preview => {
        this.preview.set(preview);
        this.state.set('preview-ready');
      },
      error: error => {
        this.state.set(isTemporaryFailure(error) ? 'preview-temporary-failure' : 'preview-unavailable');
      },
    });
  }

  continueWithAuthentik(): void {
    this.auth.login(CLAIM_ROUTE);
  }

  claimInvitation(): void {
    if (!this.token || !this.auth.isAuthenticated()) {
      this.continueWithAuthentik();
      return;
    }

    this.state.set('claiming');
    this.invitationClient.claim(this.token).subscribe({
      next: reply => {
        this.claimReply.set(reply);
        this.state.set('success');
        try {
          sessionStorage.removeItem(PENDING_INVITATION_KEY);
        } catch {
          // The token is no longer needed in memory after a successful claim.
        }
        this.token = null;
      },
      error: error => {
        const status = getHttpStatus(error);
        if (status === 401) {
          this.state.set('claim-unauthorized');
        } else if (status === 403) {
          this.state.set('claim-forbidden');
        } else if (status === 404) {
          this.state.set('claim-unavailable');
        } else {
          this.state.set('claim-temporary-failure');
        }
      },
    });
  }

  signInAgain(): void {
    this.auth.login(CLAIM_ROUTE);
  }

  switchAccount(): void {
    this.auth.switchAccount(CLAIM_ROUTE);
  }

  retryClaim(): void {
    if (this.state() === 'claim-temporary-failure') {
      this.claimInvitation();
    }
  }

  openSubscription(): void {
    const subscriptionID = this.claimReply()?.subscriptionID;
    if (subscriptionID) {
      void this.router.navigate(['/dashboard/subscription', subscriptionID]);
    }
  }
}

function getHttpStatus(error: unknown): number | undefined {
  return error instanceof HttpErrorResponse
    ? error.status
    : typeof error === 'object' && error !== null && 'status' in error && typeof error.status === 'number'
      ? error.status
      : undefined;
}

function isTemporaryFailure(error: unknown): boolean {
  const status = getHttpStatus(error);
  return status === 0 || (status !== undefined && status >= 500);
}