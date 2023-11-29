import {UserResponse} from "@features/users";
import {Table} from "@components/Elements/Table.tsx";
import {Link} from "react-router-dom";
import moment from "moment";
import {Page} from "@src/types.ts";

type UserListProps = {
    data: Page<UserResponse>,
}

export const UserList = ({data}: UserListProps) => {
    return (
        <Table<UserResponse>
            data={data.content}
            columns={[
                {
                    title: 'Name',
                    field: 'name',
                },
                {
                    title: 'Email',
                    field: 'email',
                    Cell({entry: {email}}) {
                        return <Link to={`./${encodeURIComponent(email).replace(/\./g, '%2E')}`}>{email}</Link>
                    }
                },
                {
                    title: 'Phone Number',
                    field: 'phone',
                },
                {
                    title: 'Birthday',
                    field: 'dob',
                    Cell({entry: {dob}}) {
                        return <div>{moment(dob, 'YYYY-MM-DD').format('DD/MM/YYYY')}</div>
                    }
                },
                {
                    title: 'Gender',
                    field: 'gender',
                    Cell({entry: {gender}}) {
                        return <div>{gender ? "Male" : "Female"}</div>
                    }
                },
                {
                    title: 'Role',
                    field: 'role',
                    Cell({entry: {role}}) {
                        return <div className="text-capitalize">{role?.role}</div>
                    }
                },
            ]}
        />
    )
}