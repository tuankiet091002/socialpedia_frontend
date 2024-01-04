import {UserResponse} from "src/features/user/types";

export type LoginResponse = {
    token: string;
    refreshToken: string;
    user: UserResponse;
};