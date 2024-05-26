export type ChannelQueryRequest = {
    name?: string;
    pageNo: number;
    pageSize: number;
    orderBy?: "id" | "name" | "createdBy" | "createdDate" | "modifiedDate";
    orderDirection?: "ASC" | "DESC";
}
