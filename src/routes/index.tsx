import {useRoutes} from 'react-router-dom';


import {protectedRoutes} from "./protected.tsx";
import {publicRoutes} from "./public.tsx";


export const AppRoutes = () => {

    const element = useRoutes([...publicRoutes, ...protectedRoutes])

    return <>{element}</>;
};