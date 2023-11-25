import {UserQueryRequest, UserResponse} from "@features/users";
import {Page} from "../../../types.ts";
import {Dispatch, SetStateAction} from "react";
import {Table} from "@components/Elements/Table.tsx";
import {Link} from "react-router-dom";

type UserListProps = {
    data: Page<UserResponse>,
    setQuery:  Dispatch<SetStateAction<UserQueryRequest>>

}

export const UserList = ({data, setQuery}: UserListProps) => {
    return (<Table<UserResponse>
        data={data.content}
        columns={[
            {
                title: 'Name',
                field: 'name',
            },
            {
                title: 'Email',
                field: 'email',
                Cell({ entry: { email } }) {
                    return <Link to={`./${email}`}>{email}</Link>
                }
            },

        ]}
    />)
}