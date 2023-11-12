export type RegisterUserRequest = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    bio: string;
    role: 'ADMIN' | 'USER';
};

export type LoginUserRequest = {
    email: string;
    password: string;
}

export type AuthResponse = {
    jwt: string;
    user: RegisterUserRequest;
};