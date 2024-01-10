import {ResourceEntity} from "@src/types.ts";
import {MessageResponse} from "@features/message/types/MessageResponse.ts";

export type InboxResponse = {
    id: number;
    name: string;
    avatar: ResourceEntity;
    latestMessage: MessageResponse;
}