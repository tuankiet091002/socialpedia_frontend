import {useRoutes} from "react-router-dom";
import {UsersLayout} from "@features/user/components/UsersLayout.tsx";
import {namedImport} from "@utils/namedImport.ts";
import {MessagesLayout} from "@features/message/components/MessagesLayout.tsx";

const {ChannelColumn} = namedImport(() => import("../components/ChannelColumn/ChannelColumn.tsx"), "ChannelColumn");
const {ChannelListPage} = namedImport(() => import("./ChannelListPage.tsx"), "ChannelListPage");
const {ChannelChatPage} = namedImport(() => import("./ChannelChatPage.tsx"), "ChannelChatPage");
const {ChannelProfilePage} = namedImport(() => import("./ChannelProfilePage.tsx"), "ChannelProfilePage");

export const ChannelRoutes = () => {
    return useRoutes([{
            path: 'list',
            element: <UsersLayout title={"Channels"}/>,
            children: [
                {index: true, element: <ChannelListPage/>},
            ]
        }, {
            path: '*',
            element: <MessagesLayout title={"Channels"} column={<ChannelColumn/>}/>,
            children: [
                {path: ":locationId/profile", element: <ChannelProfilePage/>},
                {path: ":locationId", element: <ChannelChatPage/>},
            ]
        }]
    )
}