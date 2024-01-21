export type ChannelQueryRequest = {
    name?: string;
    pageNo: number;
    pageSize: number;
    orderBy?: "id" | "name";
    orderDirection?: "ASC" | "DESC";
}

export function newChannelQueryRequest(): ChannelQueryRequest {
    return {pageNo: 0, pageSize: 3, orderBy: "id" as const, orderDirection: "ASC" as const};
}
