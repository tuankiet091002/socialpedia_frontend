import {RequestType} from "@src/types.ts";

export type UserFriendshipResponse = {
    senderId: number;
    receiverId: number;
    status: RequestType;
    modifiedDate: string;
    inboxId: number;
}