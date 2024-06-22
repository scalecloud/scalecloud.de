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

export interface DeleteSeatRequest {
    subscriptionID: string;
    email: string;
}

export interface DeleteSeatReply {
    subscriptionID: string;
    success: boolean;
    email: string;
}

export interface SeatDetailRequest {
    subscriptionID: string;
    uid: string;
}

export interface SeatDetailReply {
    selectedSeat: Seat;
    mySeat: Seat;
}

export interface UpdateSeatDetailRequest {
    seatUpdated: Seat;
}

export interface UpdateSeatDetailReply {
    seat: Seat;
}