export type MessageQueryRequest = {
    locationId: number,
    content?: string,
    pageNo: number,
    pageSize: number
};

export function newMessageQueryRequest(locationId: number): MessageQueryRequest {
    return {locationId, content: "", pageNo: 0, pageSize: 10}
}

