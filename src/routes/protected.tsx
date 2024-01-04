import {namedImport} from "@utils/namedImport.ts";
import {MainLayout} from "src/components/layout/MainLayout";

const {UserRoutes} = namedImport(() => import("src/features/user/routes"), "UserRoutes");
const {InboxRoutes} = namedImport(() => import("src/features/inbox/routes"), "InboxRoutes");
const {ChannelRoutes} = namedImport(() => import("src/features/channel/routes"), "ChannelRoutes");


export const protectedRoutes = [
    {
        path: '*',
        element: <MainLayout/>,
        children: [
            {path: 'user/*', element: <UserRoutes/>},
            {path: 'inbox/*', element: <InboxRoutes/>},
            {path: 'channel/*', element: <ChannelRoutes/>}
        ],
    },
];