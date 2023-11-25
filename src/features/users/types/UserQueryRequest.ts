export type UserQueryRequest = {
    name?: string;
    email?: string;
    pageNo: number;
    pageSize: number;
    orderBy?:  "id" | "name"| "email"| "dob"| "gender"| "role";
    orderDirection?: string;
}