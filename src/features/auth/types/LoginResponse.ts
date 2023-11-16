import {UserResponse} from "@features/auth";

export type LoginResponse = {
    token: string;
    refreshToken: string;
    user: UserResponse;
};