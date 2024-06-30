export enum ProductType {
    Nextcloud = "Nextcloud",
    Synology = "Synology"
}

export interface ProductTiersRequest {
    productType: ProductType;
  }
  
  export interface ProductTier {
    productType: ProductType;
    productID: string;
    name: string;
    storageAmount: number;
    storageUnit: string;
    trialDays: number;
    pricePerMonth: number;
  }
  
  export interface ProductTiersReply {
    productType: ProductType;
    productTiers: ProductTier[];
  }