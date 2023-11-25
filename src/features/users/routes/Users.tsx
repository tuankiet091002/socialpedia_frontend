import {useGetUsersQuery, UserQueryRequest} from "@features/users";
import {useState} from "react";
import {UserList} from "@features/users/components";

const INITIAL_PAGE = 3
export const Users = () => {
    //// SETTING VARIABLE
    // default query state without name field
    const initialState = {pageNo: 0, pageSize: INITIAL_PAGE, orderBy: "id" as const, orderDirection: "ASC"}
    const [query, setQuery] = useState<UserQueryRequest>(initialState)
    // variable use for search
    const [name, setName] = useState<string | undefined>(undefined)

    // main data
    const {data} = useGetUsersQuery(query);
    if(!data) return null;

    return (<div>
        <h3>User</h3>
        <UserList data={data} setQuery={{setQuery}}/>

    </div>)
}