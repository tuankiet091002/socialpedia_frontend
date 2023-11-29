import {useRoutes} from "react-router-dom";
import {UsersLayout} from "@features/users/components/UsersLayout.tsx";
import {namedImport} from "@utils/namedImport.ts";

const {Users} = namedImport(() => import("./Users.tsx"), "Users");
const {UserProfile} = namedImport(() => import("./UserProfile.tsx"), "UserProfile");


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

