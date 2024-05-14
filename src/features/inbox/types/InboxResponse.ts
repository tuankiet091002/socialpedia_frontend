import {ResourceEntity} from "@src/types.ts";
import {UserResponse} from "@features/user/types";
import {MessageResponse} from "@features/message/types/MessageResponse.ts";

export type InboxResponse = {
    id: number;
    name: string;
    avatar: ResourceEntity;
    modifiedBy: UserResponse;
    modifiedDate: string;
    latestMessage: MessageResponse;
    lastSeenMessageId: number;
}