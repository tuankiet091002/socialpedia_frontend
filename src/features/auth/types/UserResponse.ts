import {ROLES} from "@features/auth";

export type UserResponse = {
    id: number,
    email: string,
    name: string,
    phone?: string,
    dob?:   string,
    role?: DetailRole,
    gender?: boolean,
    isActive?: boolean
}

type DetailRole = {
    id: number,
    role: keyof typeof ROLES,
}

