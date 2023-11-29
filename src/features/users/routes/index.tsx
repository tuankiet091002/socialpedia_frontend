import {useRoutes} from "react-router-dom";
import {UserProfile} from "@features/users/routes/UserProfile.tsx";
import {UsersLayout} from "@features/users/components";
import {Users} from "@features/users/routes/Users.tsx";

export const UsersRoutes = () => {
    return useRoutes([{
            path: '*',
            element: <UsersLayout title={"Users"}/>,
            children: [
                {index: true, element: <Users/>},
                {path: ":userEmail", element: <UserProfile/>}
            ]
        }]
    )
}

