export interface Address {
    city: string;
    country: string;
    line1: string;
    line2: string;
    postal_code: string;
  }
  
  export interface BillingAddressRequest {
    subscriptionID: string;
  }
  
  export interface BillingAddressReply {
    subscriptionID: string;
    name: string;
    address: Address;
    phone: string;
  }
  
  export interface UpdateBillingAddressRequest {
    subscriptionID: string;
    name: string;
    address: Address;
    phone: string;
  }
  
  export interface UpdateBillingAddressReply {
    subscriptionID: string;
  }