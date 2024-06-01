import {RequestType} from "@src/types.ts";
import {UserResponse} from "@features/user/types/UserResponse.ts";

export type UserFriendshipResponse = {
    other: UserResponse;
    status: RequestType;
    modifiedDate: string;
    inboxId: number;
}