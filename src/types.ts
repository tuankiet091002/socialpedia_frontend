export type Page<T> = {
    content: T[];
    size: number,
    number: number,
    first: boolean,
    last: boolean,
    empty: boolean
    totalElements: number,
    totalPages: number,
}

export type ResourceEntity = {
    id: number;
    filename: string;
    fileType: string;
    url: string;
}

export type ErrorResponse = {
    timestamp: string;
    status: number;
    error: string;
    message: string[]
}

export type SocketMessage = {
    type: SocketType,
    owner: { id: number, name: string },
}

export enum SocketType {
    TYPE = "TYPE",
    STOP_TYPE = "STOP_TYPE",
    CHAT = "CHAT",
    JOIN = "JOIN",
    LEAVE = "LEAVE",
    SEEN = "SEEN",
}

export enum PermissionAccessType {
    NO_ACCESS = 1,
    SELF = 2,
    VIEW = 3,
    CREATE = 4,
    MODIFY = 5
}

export enum MessageStatusType {
    ACTIVE = "ACTIVE",
    MODIFIED = "MODIFIED",
    INACTIVE = "INACTIVE",
    PINNED = "PINNED",
    SYSTEM = "SYSTEM,"
}

export enum NotificationType {
    VIEW = "VIEW",
    REQUEST = "REQUEST",
    DONE = "DONE",
}

export enum RequestType {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
}