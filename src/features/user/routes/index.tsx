import {useRoutes} from "react-router-dom";
import {UsersLayout} from "@features/user/components/UsersLayout.tsx";
import {namedImport} from "@utils/namedImport.ts";

const {UserListPage} = namedImport(() => import("./UserListPage.tsx"), "UserListPage");
const {UserProfilePage} = namedImport(() => import("./UserProfilePage.tsx"), "UserProfilePage");
const {ChangePasswordPage} = namedImport(() => import("./ChangePasswordPage.tsx"), "ChangePasswordPage");

export const UserRoutes = () => {
    return useRoutes([{
            path: '*',
            element: <UsersLayout title={"User"}/>,
            children: [
                {index: true, element: <UserListPage/>},
                {path: "changePassword", element: <ChangePasswordPage/>},
                {path: ":userEmail", element: <UserProfilePage/>}
            ]
        }]
    )
}

