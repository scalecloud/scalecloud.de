export enum ProductType {
  Nextcloud = "Nextcloud",
  OpenCloud = "OpenCloud",
  Synology = "Synology"
}

export interface Product {
  productType: ProductType;
  productID: string;
  name: string;
  storageAmount: number;
  storageUnit: string;
  trialDays: number;
  pricePerMonth: number;
}

export type ProductTier = Product;

export interface ProductTiersReply {
  productType: ProductType;
  productTiers: ProductTier[];
}