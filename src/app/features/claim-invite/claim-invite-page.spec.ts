import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Auth } from '../../core/auth/auth';
import { InvitationClient } from './invitation-client';
import { ClaimInvitePage } from './claim-invite-page';
import { InvitationClaimReply, InvitationPreview } from './invitation-model';

const PREVIEW: InvitationPreview = {
  productName: 'OpenCloud Storage',
  storageAmount: 4,
  storageUnit: 'TB',
  email: 'invitee@example.test',
  roles: ['member'],
  expiresAt: 1_800_000_000,
};

const CLAIM_REPLY: InvitationClaimReply = {
  subscriptionID: 'subscription-123',
  productName: 'OpenCloud Storage',
  storageAmount: 4,
  storageUnit: 'TB',
  roles: ['member'],
  success: true,
};

describe('ClaimInvitePage', () => {
  let fixture: ComponentFixture<ClaimInvitePage>;
  let component: ClaimInvitePage;
  let authenticated: boolean;

  const auth = {
    init: vi.fn(() => Promise.resolve()),
    resolved: signal(true),
    isAuthenticated: vi.fn(() => authenticated),
    login: vi.fn(),
    switchAccount: vi.fn(),
  };
  const invitationClient = {
    preview: vi.fn(() => of(PREVIEW)),
    claim: vi.fn(() => of(CLAIM_REPLY)),
  };
  const location = { replaceState: vi.fn() };
  const router = { navigate: vi.fn(() => Promise.resolve(true)) };

  function createPage(token: string | null = 'private-invitation-token'): void {
    TestBed.configureTestingModule({
      imports: [ClaimInvitePage],
      providers: [
        { provide: Auth, useValue: auth },
        { provide: InvitationClient, useValue: invitationClient },
        { provide: Location, useValue: location },
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParamMap: convertToParamMap(token ? { token } : {}) } },
        },
      ],
    });
    fixture = TestBed.createComponent(ClaimInvitePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    authenticated = false;
    invitationClient.preview.mockReturnValue(of(PREVIEW));
    invitationClient.claim.mockReturnValue(of(CLAIM_REPLY));
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('removes the query token from the URL and retains it in session storage for OIDC return', () => {
    createPage();

    expect(location.replaceState).toHaveBeenCalledWith('/claim-invite');
    expect(sessionStorage.getItem('scalecloud.invitation.pendingToken')).toBe('private-invitation-token');
    expect(invitationClient.preview).toHaveBeenCalledWith('private-invitation-token');
    expect(component.state()).toBe('preview-ready');
  });

  it('restores the pending token after the OIDC callback when the URL has no token', () => {
    sessionStorage.setItem('scalecloud.invitation.pendingToken', 'private-invitation-token');
    createPage(null);

    expect(location.replaceState).not.toHaveBeenCalled();
    expect(invitationClient.preview).toHaveBeenCalledWith('private-invitation-token');
    expect(component.state()).toBe('preview-ready');
  });

  it('offers Authentik login for an unauthenticated user and returns to the claim route', () => {
    createPage();

    fixture.nativeElement.querySelector('button').click();

    expect(auth.login).toHaveBeenCalledWith('/claim-invite');
  });

  it('claims for an authenticated user, clears the token, and opens the returned subscription', () => {
    authenticated = true;
    createPage();

    const button = fixture.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();

    expect(invitationClient.claim).toHaveBeenCalledWith('private-invitation-token');
    expect(component.state()).toBe('success');
    expect(sessionStorage.getItem('scalecloud.invitation.pendingToken')).toBeNull();
    component.openSubscription();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard/subscription', 'subscription-123']);
  });

  it('shows unavailable when the preview endpoint rejects the invitation', () => {
    invitationClient.preview.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 404 })));
    createPage();

    expect(component.state()).toBe('preview-unavailable');
    expect(fixture.nativeElement.textContent).toContain('Invitation unavailable');
  });

  it('explains a mismatched account and offers account switching after a 403', () => {
    authenticated = true;
    invitationClient.claim.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 403 })));
    createPage();

    component.claimInvitation();
    fixture.detectChanges();

    expect(component.state()).toBe('claim-forbidden');
    expect(fixture.nativeElement.textContent).toContain('cannot claim the invitation');
    fixture.nativeElement.querySelector('button').click();
    expect(auth.switchAccount).toHaveBeenCalledWith('/claim-invite');
  });

  it('offers sign-in again after a 401', () => {
    authenticated = true;
    invitationClient.claim.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 401 })));
    createPage();

    component.claimInvitation();

    expect(component.state()).toBe('claim-unauthorized');
    component.signInAgain();
    expect(auth.login).toHaveBeenCalledWith('/claim-invite');
  });

  it('shows unavailable if the claim endpoint returns 404', () => {
    authenticated = true;
    invitationClient.claim.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 404 })));
    createPage();

    component.claimInvitation();

    expect(component.state()).toBe('claim-unavailable');
  });

  it('retries a temporary claim failure with the same token and account', () => {
    authenticated = true;
    invitationClient.claim
      .mockReturnValueOnce(throwError(() => new HttpErrorResponse({ status: 503 })))
      .mockReturnValueOnce(of(CLAIM_REPLY));
    createPage();

    component.claimInvitation();
    expect(component.state()).toBe('claim-temporary-failure');
    component.retryClaim();

    expect(invitationClient.claim).toHaveBeenNthCalledWith(1, 'private-invitation-token');
    expect(invitationClient.claim).toHaveBeenNthCalledWith(2, 'private-invitation-token');
    expect(component.state()).toBe('success');
  });
});