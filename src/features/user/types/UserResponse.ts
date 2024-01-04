import {PermissionAccessType, ResourceEntity} from "@src/types.ts";

export type UserResponse = {
    id: number,
    email: string,
    name: string,
    phone?: string,
    dob?: string,
    role?: DetailRole,
    gender?: boolean,
    isActive?: boolean,
    avatar: ResourceEntity
    friends?: UserResponse[]
}

type DetailRole = {
    name: string,
    userPermission: PermissionAccessType;
    channelPermission: PermissionAccessType;
}

