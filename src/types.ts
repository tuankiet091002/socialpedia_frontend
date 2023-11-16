export type Page<T> = {
    content: T[];
    "last": boolean,
    "totalElements": number,
    "totalPages": number,
    "size": number,
    "number": number,
    "sort": {
        "empty": boolean,
        "sorted": boolean,
        "unsorted": boolean
    },
    "first": boolean,
    "numberOfElements": number,
    "empty": boolean
}

export type ResourceEntity = {
    id: number,
    filename: string,
    url: string
}