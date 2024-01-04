export type ChannelQueryRequest = {
    name?: string;
    pageNo: number;
    pageSize: number;
    orderBy?: "id" | "name";
    orderDirection?: "ASC" | "DESC";
}
