
import {namedImport} from "@utils/namedImport.ts";
import {MainLayout} from "@components/Layout/MainLayout";

const {MessagesRoutes} = namedImport(() => import("@features/messages/routes"), "MessagesRoutes");
const {UsersRoutes} = namedImport(() => import("@features/users/routes"), "UsersRoutes");


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