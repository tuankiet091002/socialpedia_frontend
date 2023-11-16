export type RegisterRequest = {
    email: string,
    name: string,
    password: string,
    phone: string,
    dob: string,
    role: keyof typeof ROLES,
    gender: boolean
};

export enum ROLES {
    ADMIN = 'admin',
    USER = 'user',
}