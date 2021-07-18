import { SynologyProduct } from "./synology-product";

export const SYNOLOGYPRODUCTS: SynologyProduct[] = [
  {
    productId: 4,
    name: "Midnight",
    storageAmount: 3,
    scalable: true,
    trialDays: 14,
    usersPerSubscription: 1,
    pricePerMonth: 10
  }, {
    productId: 5,
    name: "Royal",
    storageAmount: 6,
    scalable: true,
    trialDays: 14,
    usersPerSubscription: 1,
    pricePerMonth: 15
  }, {
    productId: 6,
    name: "Icy",
    storageAmount: 12,
    scalable: true,
    trialDays: 14,
    usersPerSubscription: 1,
    pricePerMonth: 25
  }, {
    productId: 7,
    name: "Rose",
    storageAmount: 24,
    scalable: true,
    trialDays: 14,
    usersPerSubscription: 1,
    pricePerMonth: 50
  }
];