import { NextcloudProduct } from "./nextcloud-product";

export const NEXTCLOUDPRODUCTS: NextcloudProduct[] = [
  {
    productId: 0,
    name: "Ruby",
    storageAmount: 3,
    scalable: true,
    trialDays: 30,
    usersPerSubscription: 1,
    pricePerMonth: 10
  },
  {
    productId: 1,
    name: "Jade",
    storageAmount: 6,
    scalable: true,
    trialDays: 30,
    usersPerSubscription: 1,
    pricePerMonth: 15
  }, {
    productId: 2,
    name: "Frosted",
    storageAmount: 12,
    scalable: true,
    trialDays: 30,
    usersPerSubscription: 1,
    pricePerMonth: 25
  }, {
    productId: 3,
    name: "Obsidian",
    storageAmount: 24,
    scalable: true,
    trialDays: 30,
    usersPerSubscription: 1,
    pricePerMonth: 50
  }
];