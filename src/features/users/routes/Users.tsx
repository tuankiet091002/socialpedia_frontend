
import {useState} from "react";
import {UserQueryRequest} from "@features/users/types";
import {useGetUsersQuery} from "@features/users/api.ts";
import {UserList} from "@features/users/components/UserList.tsx";
import {UserPaging} from "@features/users/components/UserPaging.tsx";

const INITIAL_PAGE = 5
export const Users = () => {
    //// SETTING VARIABLE
    // default query state without name field
    const initialState = {pageNo: 0, pageSize: INITIAL_PAGE, orderBy: "id" as const, orderDirection: "ASC"}
    const [query, setQuery] = useState<UserQueryRequest>(initialState)
    // variable use for search


    // main data
    const {data} = useGetUsersQuery(query);
    if (!data) return null;

    return (<div className="container-fluid d-flex flex-column align-items-center p-2 h-100"
                 style={{backgroundColor: "white"}}>
        <h3>User</h3>
        <UserList data={data}/>
        <UserPaging data={data} setQuery={setQuery}/>

    </div>)
}