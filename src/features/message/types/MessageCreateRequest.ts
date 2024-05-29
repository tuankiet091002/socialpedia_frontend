export type MessageCreateRequest = {
    locationId: number,
    content: string,
    replyTo?: number
    files: File[],
};