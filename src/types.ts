export type Page<T> = {
    content: T[];
    "last": boolean,
    "totalElements": number,
    "totalPages": number,
    "size": number,
    "number": number,
    "first": boolean,
    "empty": boolean
}

export type ResourceEntity = {
    id: number,
    filename: string,
    url: string
}

export type ErrorResponse = {
    timestamp: string;
    status: number;
    error: string;
    message: string[]
}

export type SocketMessage = {
    type: SocketType,
    content: string,
    sender: string,
}

export enum SocketType {
    CHAT, JOIN, LEAVE
}