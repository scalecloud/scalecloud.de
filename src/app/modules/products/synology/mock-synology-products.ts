import { SynologyProduct } from "./synology-product";

export const SYNOLOGYPRODUCTS: SynologyProduct[] = [
  {
    productId: 4,
    name: "Midnight",
    storageIcon: "cloud",
    storageAmount: 3,
    storageUnit: "TB",
    scalableIcon: "height",
    trialDays: 14,
    trialIcon: "event_available",
    usersIcon: "person",
    usersAmount: 1,
    pricePerMonth: 10
  }, {
    productId: 5,
    name: "Royal",
    storageIcon: "cloud",
    storageAmount: 6,
    storageUnit: "TB",
    scalableIcon: "height",
    trialIcon: "event_available",
    trialDays: 14,
    usersIcon: "person",
    usersAmount: 1,
    pricePerMonth: 15
  }, {
    productId: 6,
    name: "Icy",
    storageIcon: "cloud",
    storageAmount: 12,
    storageUnit: "TB",
    scalableIcon: "height",
    trialIcon: "event_available",
    trialDays: 14,
    usersIcon: "person",
    usersAmount: 1,
    pricePerMonth: 25
  }, {
    productId: 7,
    name: "Rose",
    storageIcon: "cloud",
    storageAmount: 24,
    storageUnit: "TB",
    scalableIcon: "height",
    trialIcon: "event_available",
    trialDays: 14,
    usersIcon: "person",
    usersAmount: 1,
    pricePerMonth: 50
  }
];