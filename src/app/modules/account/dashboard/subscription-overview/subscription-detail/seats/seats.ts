import { Role } from "src/app/shared/roles/roles";

export interface Seat {
    subscriptionID: string;
    uid: string;
    email: string;
    roles: Role[];
}

export interface ListSeatRequest {
    subscriptionID: string;
    pageIndex: number;
    pageSize: number;
}

export interface ListSeatReply {
    subscriptionID: string;
    maxSeats: number;
    seats: Seat[];
    pageIndex: number;
    totalResults: number;
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