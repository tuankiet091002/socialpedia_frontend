import {useRoutes} from "react-router-dom";
import {namedImport} from "@utils/namedImport.ts";

const {LoginPage} = namedImport(() => import("./LoginPage.tsx"), "LoginPage");
const {RegisterPage} = namedImport(() => import("./RegisterPage.tsx"), "RegisterPage");

export const AuthRoutes = () => {
    return useRoutes([
        {path: 'login', element: <LoginPage/>},
        {path: 'register', element: <RegisterPage/>}
    ])
};