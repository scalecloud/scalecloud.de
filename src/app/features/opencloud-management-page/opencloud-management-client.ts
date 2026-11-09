import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from 'src/app/core/config/api-token';
import {
  OpenCloudCreateSpaceRequest,
  OpenCloudAddSpaceMemberRequest,
  OpenCloudInviteUserRequest,
  OpenCloudOverviewReply,
  OpenCloudOverviewRequest,
  OpenCloudRemoveSpaceMemberRequest,
  OpenCloudUpdateSpaceStorageRequest,
  OpenCloudUpdateOwnerStorageRequest,
  OpenCloudUpdateUserRolesRequest,
  OpenCloudUpdateUserStorageRequest,
} from './opencloud-management-model';

@Injectable({ providedIn: 'root' })
export class OpenCloudManagementClient {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);
  private readonly baseUrl = `${this.apiUrl}/dashboard/opencloud`;

  getOverview(request: OpenCloudOverviewRequest): Observable<OpenCloudOverviewReply> {
    return this.http.post<OpenCloudOverviewReply>(`${this.baseUrl}/overview`, request);
  }

  inviteUser(request: OpenCloudInviteUserRequest): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/invite-user`, request);
  }

  updateUserStorage(request: OpenCloudUpdateUserStorageRequest): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/update-user-storage`, request);
  }

  updateUserRoles(request: OpenCloudUpdateUserRolesRequest): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/update-user-roles`, request);
  }

  updateOwnerStorage(request: OpenCloudUpdateOwnerStorageRequest): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/update-owner-storage`, request);
  }

  createSpace(request: OpenCloudCreateSpaceRequest): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/create-space`, request);
  }

  updateSpaceStorage(request: OpenCloudUpdateSpaceStorageRequest): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/update-space-storage`, request);
  }

  addSpaceMember(request: OpenCloudAddSpaceMemberRequest): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/add-space-member`, request);
  }

  removeSpaceMember(request: OpenCloudRemoveSpaceMemberRequest): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/remove-space-member`, request);
  }

}