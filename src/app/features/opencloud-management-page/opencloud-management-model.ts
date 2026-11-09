export interface OpenCloudUsagePoint {
  date: string;
  usedQuantity: number;
}

export interface OpenCloudOwnerAllocation {
  uid: string;
  email: string;
  openCloudLinked: boolean;
  storageQuantity: number;
  usedQuantity?: number;
  dailyUsage?: OpenCloudUsagePoint[];
}

export interface OpenCloudUserAllocation {
  uid: string;
  email: string;
  roles: string[];
  openCloudLinked: boolean;
  storageQuantity: number;
  usedQuantity?: number;
  dailyUsage?: OpenCloudUsagePoint[];
}

export interface OpenCloudPersonAllocation extends OpenCloudUserAllocation {
  isOwner: boolean;
}

export interface OpenCloudSpaceAllocation {
  id: string;
  name: string;
  storageQuantity: number;
  memberCount: number;
  members: OpenCloudManagedSpaceMember[];
  usedQuantity?: number;
  dailyUsage?: OpenCloudUsagePoint[];
}

export interface OpenCloudManagedSpaceMember {
  permissionID: string;
  uid?: string;
  userID?: string;
  groupID?: string;
  displayName?: string;
  email?: string;
}

export interface OpenCloudOverviewRequest {
  subscriptionID: string;
}

export interface OpenCloudUpdateOwnerStorageRequest {
  subscriptionID: string;
  storageQuantity: number;
}

export interface OpenCloudOverviewReply {
  subscriptionID: string;
  totalQuantity: number;
  storageAmount: number;
  storageUnit: string;
  owner: OpenCloudOwnerAllocation;
  users: OpenCloudUserAllocation[];
  spaces: OpenCloudSpaceAllocation[];
}

export interface OpenCloudInviteUserRequest {
  subscriptionID: string;
  email: string;
  storageQuantity: number;
}

export interface OpenCloudUpdateUserStorageRequest {
  subscriptionID: string;
  uid: string;
  storageQuantity: number;
}

export interface OpenCloudUpdateUserRolesRequest {
  subscriptionID: string;
  uid: string;
  roles: string[];
}

export interface OpenCloudCreateSpaceRequest {
  subscriptionID: string;
  name: string;
  storageQuantity: number;
}

export interface OpenCloudUpdateSpaceStorageRequest {
  subscriptionID: string;
  spaceID: string;
  storageQuantity: number;
}

export interface OpenCloudAddSpaceMemberRequest {
  subscriptionID: string;
  spaceID: string;
  uid: string;
}

export interface OpenCloudRemoveSpaceMemberRequest {
  subscriptionID: string;
  spaceID: string;
  permissionID: string;
}

