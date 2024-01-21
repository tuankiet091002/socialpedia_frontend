export type InboxQueryRequest = {
    name?: string;
    pageNo: number;
    pageSize: number;
}

export function newInboxQueryRequest(): InboxQueryRequest {
    return {name: "", pageNo: 0, pageSize: 3};
}