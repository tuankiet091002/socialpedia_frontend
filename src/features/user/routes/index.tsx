import {useRoutes} from "react-router-dom";
import {namedImport} from "@utils/namedImport.ts";

const {UserListPage} = namedImport(() => import("./UserListPage.tsx"), "UserListPage");
const {UserProfilePage} = namedImport(() => import("./UserProfilePage.tsx"), "UserProfilePage");
const {MyProfilePage} = namedImport(() => import("./MyProfilePage.tsx"), "MyProfilePage");
const {ChangePasswordPage} = namedImport(() => import("./ChangePasswordPage.tsx"), "ChangePasswordPage");

export const UserRoutes = () => {
    return useRoutes([
        {path: "list", element: <UserListPage/>},
        {path: "password", element: <ChangePasswordPage/>},
        {path: "profile", element: <MyProfilePage/>},
        {path: ":userId", element: <UserProfilePage/>}]
    );
};

