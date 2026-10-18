export interface InvitationPreview {
  productName: string;
  storageAmount: number;
  storageUnit: string;
  email: string;
  roles: string[];
  expiresAt: number;
}

export interface InvitationClaimReply {
  subscriptionID: string;
  productName: string;
  storageAmount: number;
  storageUnit: string;
  roles: string[];
  success: true;
}

export interface InvitationRequest {
  token: string;
}