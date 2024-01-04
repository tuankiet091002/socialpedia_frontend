export type UserQueryRequest = {
    name?: string;
    pageNo: number;
    pageSize: number;
    orderBy?: "id" | "name" | "email" | "dob" | "gender" | "role";
    orderDirection?: "ASC" | "DESC";
}