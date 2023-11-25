import {MainLayout} from '@components/Layout';
import {namedImport} from "@utils/namedImport.ts";

const {MessagesRoutes} = namedImport(() => import("@features/messages"), "MessagesRoutes");
const {UsersRoutes} = namedImport(() => import("@features/users"), "UsersRoutes");

export const protectedRoutes = [
    {
        path: '/*',
        element: <MainLayout/>,
        children: [
            {path: 'messages/*', element: <MessagesRoutes/>},
            {path: 'users/*', element: <UsersRoutes/>},
        ],
    },
];