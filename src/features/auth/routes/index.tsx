import {useRoutes} from "react-router-dom";

import {Login} from './Login';
import {Register} from './Register';

export const AuthRoutes = () => {
    return useRoutes([
        {path: 'login', element: <Login/>},
        {path: 'register', element: <Register/>}
    ])
};