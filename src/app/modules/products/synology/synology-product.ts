export interface SynologyProduct {
  productId: number;
  name: string;
  storageAmount: number;
  scalable: boolean;
  trialDays: number;
  usersPerSubscription: number;
  pricePerMonth: number;
}