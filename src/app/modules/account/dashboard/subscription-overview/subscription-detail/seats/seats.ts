export interface SeatListRequest {
    subscriptionID: string;
}

export interface SeatListReply {
    subscriptionID: string;
    product_name: string;
    product_type: string;
    max_seats: number;    
    email: string[];
}

export interface AddSeatRequest {
    subscriptionID: string;
    email: string;
}

export interface AddSeatReply {
    subscriptionID: string;
    success: boolean;
    email: string;
}

export interface RemoveSeatRequest {
    subscriptionID: string;
    email: string;
}

export interface RemoveSeatReply {
    subscriptionID: string;
    success: boolean;
    email: string;
}