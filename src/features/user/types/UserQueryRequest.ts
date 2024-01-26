export type UserQueryRequest = {
    name?: string;
    pageNo: number;
    pageSize: number;
    orderBy?: "id" | "name" | "email" | "phone" | "dob" | "gender" | "role";
    orderDirection?: "ASC" | "DESC";
}