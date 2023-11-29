import {useRoutes} from "react-router-dom";
import {namedImport} from "@utils/namedImport.ts";

const {Login} = namedImport(() => import("./Login.tsx"), "Login");
const {Register} = namedImport(() => import("./Register.tsx"), "Register");

export const AuthRoutes = () => {
    return useRoutes([
        {path: 'login', element: <Login/>},
        {path: 'register', element: <Register/>}
    ])
};