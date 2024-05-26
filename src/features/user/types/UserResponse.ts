import {PermissionAccessType, ResourceEntity} from "@src/types.ts";

export type UserResponse = {
    id: number,
    name: string,
    phone?: string,
    dob?: string,
    role?: DetailRole,
    gender?: boolean,
    avatar: ResourceEntity
}

type DetailRole = {
    name: string,
    userPermission: PermissionAccessType;
    channelPermission: PermissionAccessType;
}

