import {namedImport} from '@utils/namedImport.ts';
import {AuthLayout} from "@features/auth/components/AuthLayout.tsx";

const {AuthRoutes} = namedImport(() => import('@features/auth'), 'AuthRoutes');


export const publicRoutes = [
    {
        path: 'auth/*',
        element: <AuthLayout/>,
        children: [
            {path: "*", element: <AuthRoutes/>}
        ]
    },
];