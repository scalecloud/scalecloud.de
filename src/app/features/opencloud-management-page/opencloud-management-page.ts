import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatTabLink, MatTabNav, MatTabNavPanel } from '@angular/material/tabs';
import { LoadingFailed } from '../../shared/loading-failed/loading-failed';
import { Log } from '../../core/logging/log';
import { SnackBar } from '../../core/snackbar/snack-bar';
import { ServiceStatus } from '../../shared/client-status';
import { OpenCloudManagementClient } from './opencloud-management-client';
import { BillingPortalClient } from '../subscription-detail-page/customer-portal/billing-portal-client';
import {
  OpenCloudAddSpaceMemberRequest,
  OpenCloudCreateSpaceRequest,
  OpenCloudInviteUserRequest,
  OpenCloudOverviewReply,
  OpenCloudRemoveSpaceMemberRequest,
  OpenCloudUpdateUserRolesRequest,
} from './opencloud-management-model';
import { OpenCloudSummary } from './opencloud-summary/opencloud-summary';
import { OpenCloudUsers } from './opencloud-users/opencloud-users';
import { OpenCloudSpaces } from './opencloud-spaces/opencloud-spaces';

@Component({
  selector: 'app-opencloud-management-page',
  templateUrl: './opencloud-management-page.html',
  styleUrl: './opencloud-management-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, MatProgressBar, MatButton, MatIconButton, MatFormField, MatLabel, MatPrefix, MatSuffix, MatInput, MatTabLink, MatTabNav, MatTabNavPanel, LoadingFailed, OpenCloudSummary, OpenCloudUsers, OpenCloudSpaces],
})
export class OpenCloudManagementPage implements OnInit {
  private readonly client = inject(OpenCloudManagementClient);
  private readonly billingPortal = inject(BillingPortalClient);
  private readonly route = inject(ActivatedRoute);
  private readonly log = inject(Log);
  private readonly snackBar = inject(SnackBar);

  readonly ServiceStatus = ServiceStatus;
  readonly serviceStatus = signal(ServiceStatus.Initializing);
  readonly overview = signal<OpenCloudOverviewReply | null>(null);
  readonly busy = signal(false);
  readonly activeTab = signal<'people' | 'spaces'>('people');
  readonly showForm = signal(false);
  readonly searchQuery = signal('');
  readonly people = computed(() => {
    const data = this.overview();
    if (!data) return [];
    return [
      {
        uid: data.owner.uid || data.owner.email,
        email: data.owner.email,
        roles: ['Owner'],
        openCloudLinked: data.owner.openCloudLinked,
        storageQuantity: data.owner.storageQuantity,
        usedQuantity: data.owner.usedQuantity ?? 0,
        dailyUsage: data.owner.dailyUsage ?? [],
        isOwner: true,
      },
      ...data.users.map((user) => ({ ...user, isOwner: false })),
    ];
  });
  readonly availableQuantity = computed(() => {
    const data = this.overview();
    if (!data) return 0;
    const allocated = data.owner.storageQuantity
      + data.users.reduce((total, user) => total + user.storageQuantity, 0)
      + data.spaces.reduce((total, space) => total + space.storageQuantity, 0);
    return Math.max(0, data.totalQuantity - allocated);
  });

  ngOnInit(): void {
    this.loadOverview();
  }

  loadOverview(showLoading = true): void {
    const subscriptionID = this.subscriptionID();
    if (!subscriptionID) {
      this.log.error('OpenCloudManagementPage.loadOverview: subscriptionID is missing');
      this.serviceStatus.set(ServiceStatus.Error);
      return;
    }

    if (showLoading) this.serviceStatus.set(ServiceStatus.Loading);
    this.client.getOverview({ subscriptionID }).subscribe({
      next: (reply) => {
        this.overview.set(reply);
        this.serviceStatus.set(ServiceStatus.Success);
        this.busy.set(false);
      },
      error: (error: unknown) => {
        this.log.error('OpenCloud storage overview failed', error);
        this.serviceStatus.set(ServiceStatus.Error);
        this.busy.set(false);
      },
    });
  }

  inviteUser(request: Omit<OpenCloudInviteUserRequest, 'subscriptionID'>): void {
    this.mutate(
      () => this.client.inviteUser({ ...request, subscriptionID: this.subscriptionID() }),
      'Invitation sent.',
      () => this.showForm.set(false),
    );
  }

  updateUserStorage(request: { uid: string; storageQuantity: number }): void {
    this.mutate(
      () => this.client.updateUserStorage({ ...request, subscriptionID: this.subscriptionID() }),
      'Personal storage updated.',
    );
  }

  updateUserRoles(request: Omit<OpenCloudUpdateUserRolesRequest, 'subscriptionID'>): void {
    this.mutate(
      () => this.client.updateUserRoles({ ...request, subscriptionID: this.subscriptionID() }),
      'User roles updated.',
    );
  }

  updatePersonStorage(request: { uid: string; storageQuantity: number; isOwner: boolean }): void {
    if (request.isOwner) {
      this.updateOwnerStorage(request.storageQuantity);
      return;
    }
    this.updateUserStorage(request);
  }

  updateOwnerStorage(storageQuantity: number): void {
    this.mutate(
      () => this.client.updateOwnerStorage({ storageQuantity, subscriptionID: this.subscriptionID() }),
      'Personal storage updated.',
    );
  }

  createSpace(request: Omit<OpenCloudCreateSpaceRequest, 'subscriptionID'>): void {
    this.mutate(
      () => this.client.createSpace({ ...request, subscriptionID: this.subscriptionID() }),
      'Space created.',
      () => this.showForm.set(false),
    );
  }

  updateSpaceStorage(request: { spaceID: string; storageQuantity: number }): void {
    this.mutate(
      () => this.client.updateSpaceStorage({ ...request, subscriptionID: this.subscriptionID() }),
      'Space storage updated.',
    );
  }

  addSpaceMember(request: Omit<OpenCloudAddSpaceMemberRequest, 'subscriptionID'>): void {
    this.mutate(
      () => this.client.addSpaceMember({ ...request, subscriptionID: this.subscriptionID() }),
      'Person added to space.',
    );
  }

  removeSpaceMember(request: Omit<OpenCloudRemoveSpaceMemberRequest, 'subscriptionID'>): void {
    this.mutate(
      () => this.client.removeSpaceMember({ ...request, subscriptionID: this.subscriptionID() }),
      'Person removed from space.',
    );
  }

  selectTab(tab: 'people' | 'spaces'): void {
    this.activeTab.set(tab);
    this.showForm.set(false);
    this.searchQuery.set('');
  }

  openForm(): void {
    if (this.activeTab() === 'spaces' && this.availableQuantity() < 1) return;
    this.showForm.set(true);
  }

  openBillingPortal(): void {
    this.billingPortal.getBillingPortal().subscribe({
      next: (portal) => window.open(portal.url, '_blank', 'noopener'),
      error: (error: unknown) => {
        this.log.error('OpenCloudManagementPage.openBillingPortal failed', error);
        this.snackBar.error('Could not open billing settings. Please try again.');
      },
    });
  }

  private mutate(action: () => Observable<unknown>, successMessage: string, onSuccess?: () => void): void {
    if (this.busy()) return;
    this.busy.set(true);
    this.snackBar.infoDuration('Changes are being saved', 0);
    action().subscribe({
      next: () => {
        this.snackBar.info(successMessage);
        onSuccess?.();
        this.loadOverview(false);
      },
      error: (error: unknown) => {
        this.log.error('OpenCloud storage update failed', error);
        this.snackBar.error('Could not update OpenCloud storage. Please try again.');
        this.busy.set(false);
      },
    });
  }

  private subscriptionID(): string {
    return this.route.snapshot.paramMap.get('subscriptionID') ?? '';
  }
}