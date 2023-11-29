import {ROLES} from "@features/auth";
import {ResourceEntity} from "@src/types.ts";

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
    id: number,
    role: keyof typeof ROLES,
}

