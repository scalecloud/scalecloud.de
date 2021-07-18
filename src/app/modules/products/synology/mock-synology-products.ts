import { SynologyProduct } from "./synology-product";

export const SYNOLOGYPRODUCTS: SynologyProduct[] = [
  {
    productId: 0,
    name: "Midnight",
    storageAmount: 3,
    scalable: true,
    trialDays: 30,
    usersPerSubscription: 1,
    pricePerMonth: 10
  },
  {
    productId: 1,
    name: "Royal",
    storageAmount: 6,
    scalable: true,
    trialDays: 30,
    usersPerSubscription: 1,
    pricePerMonth: 15
  }, {
    productId: 2,
    name: "Icy",
    storageAmount: 12,
    scalable: true,
    trialDays: 30,
    usersPerSubscription: 1,
    pricePerMonth: 25
  }, {
    productId: 3,
    name: "Rose",
    storageAmount: 24,
    scalable: true,
    trialDays: 30,
    usersPerSubscription: 1,
    pricePerMonth: 50
  }
];