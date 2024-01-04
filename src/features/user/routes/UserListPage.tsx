import {UserList} from "@features/user/components/UserList.tsx";

export const UserListPage = () => {

    return (<div className="container-fluid d-flex flex-column align-items-center p-2 h-100"
                 style={{backgroundColor: "white"}}>
        <h3>User</h3>
        <UserList/>
        {/*<UserPaging/>*/}

    </div>)
}