import { Role } from "src/app/shared/roles/roles";

export interface ListSeatRequest {
    subscriptionID: string;
}

export interface ListSeatReply {
    subscriptionID: string;
    max_seats: number;    
    emails: string[];
}

export interface AddSeatRequest {
    subscriptionID: string;
    email: string;
    roles: Role[];
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