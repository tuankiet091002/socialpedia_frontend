export type MessageCreateRequest = {
    locationId: number,
    content: string,
    files: File[],
};