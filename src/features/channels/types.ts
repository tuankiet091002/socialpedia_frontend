export type ChannelQueryRequest = {
    conversationId: string
};

export type ChannelCreateRequest = {
    name: string
};

export type ChannelUpdateRequest = {
    id: string
    name: string
};

export type ChannelResponse = {
    id: string,
    name: string,
    createdBy: string,
    createdDate: Date
};