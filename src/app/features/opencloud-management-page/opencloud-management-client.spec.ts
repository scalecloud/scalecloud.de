import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { API_URL } from 'src/app/core/config/api-token';
import { OpenCloudManagementClient } from './opencloud-management-client';

describe('OpenCloudManagementClient', () => {
  let client: OpenCloudManagementClient;
  let http: HttpTestingController;
  const apiUrl = 'https://api.example.com';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_URL, useValue: apiUrl },
      ],
    });
    client = TestBed.inject(OpenCloudManagementClient);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads the OpenCloud overview through its dedicated endpoint', () => {
    const request = { subscriptionID: 'sub-1' };
    client.getOverview(request).subscribe();

    const req = http.expectOne(`${apiUrl}/dashboard/opencloud/overview`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush({ subscriptionID: 'sub-1', totalQuantity: 1, storageAmount: 1, storageUnit: 'TB', owner: {}, users: [], spaces: [] });
  });

  it('adds a linked person to a space', () => {
    const request = { subscriptionID: 'sub-1', spaceID: 'space-1', uid: 'user-1' };
    client.addSpaceMember(request).subscribe();

    const req = http.expectOne(`${apiUrl}/dashboard/opencloud/add-space-member`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush({ success: true });
  });

  it('removes a permission from a space', () => {
    const request = { subscriptionID: 'sub-1', spaceID: 'space-1', permissionID: 'permission-1' };
    client.removeSpaceMember(request).subscribe();

    const req = http.expectOne(`${apiUrl}/dashboard/opencloud/remove-space-member`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush({ success: true });
  });

  it('updates a subscription member\'s roles', () => {
    const request = { subscriptionID: 'sub-1', uid: 'user-1', roles: ['User', 'Billing'] };
    client.updateUserRoles(request).subscribe();

    const req = http.expectOne(`${apiUrl}/dashboard/opencloud/update-user-roles`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush({ success: true });
  });
});