import {UserResponse} from "@features/user/types";
import {ResourceEntity} from "@src/types.ts";

export type MessageResponse = {
    id: number,
    content: string,
    resources: ResourceEntity[],
    createdBy: UserResponse | string,
    modifiedDate: string
};