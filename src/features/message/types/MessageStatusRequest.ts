import {MessageStatusType} from "@src/types.ts";

export type MessageStatusRequest = {
    locationId: number;
    id: number;
    status: MessageStatusType;
}