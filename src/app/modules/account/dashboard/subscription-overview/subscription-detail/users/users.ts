import { Role } from "src/app/shared/roles/roles";

export interface ListUserRequest {
    subscriptionID: string;
}

export interface ListUserReply {
    subscriptionID: string;
    max_users: number;    
    emails: string[];
}

export interface AddUserRequest {
    subscriptionID: string;
    email: string;
    roles: Role[];
}

export interface AddUserReply {
    subscriptionID: string;
    success: boolean;
    email: string;
}

export interface RemoveUserRequest {
    subscriptionID: string;
    email: string;
}

export interface RemoveUserReply {
    subscriptionID: string;
    success: boolean;
    email: string;
}