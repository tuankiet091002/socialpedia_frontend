export type MessageQueryRequest = {
    conversationId: string
};

export type MessageCreateRequest = {
    conversationId: string,
    content: string
};

export type MessageUpdateRequest = {
    id: string
    content: string
};

export type MessageResponse = {
    id: string,
    content: string,
    createdBy: string,
    createdDate: Date
};