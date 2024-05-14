import {UserResponse} from "@features/user/types";
import {MessageStatusType, ResourceEntity} from "@src/types.ts";

export type MessageResponse = {
    id: number,
    status: MessageStatusType,
    content: string,
    resources: ResourceEntity[],
    createdBy?: UserResponse,
    modifiedDate?: string,
    replies: MessageResponse[]
};