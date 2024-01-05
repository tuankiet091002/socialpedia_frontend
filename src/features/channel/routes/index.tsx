import {useRoutes} from "react-router-dom";
import {namedImport} from "@utils/namedImport.ts";
import {TwoSectionLayout} from "@components/layout/TwoSectionLayout.tsx";

const {ChannelColumn} = namedImport(() => import("../components/ChannelColumn/ChannelColumn.tsx"), "ChannelColumn");
const {ChannelListPage} = namedImport(() => import("./ChannelListPage.tsx"), "ChannelListPage");
const {ChannelChatPage} = namedImport(() => import("./ChannelChatPage.tsx"), "ChannelChatPage");
const {ChannelProfilePage} = namedImport(() => import("./ChannelProfilePage.tsx"), "ChannelProfilePage");

export const ChannelRoutes = () => {
    return useRoutes([
        {path: 'list', element: <ChannelListPage/>},
        {
            path: '*',
            element: <TwoSectionLayout navbar={<ChannelColumn/>}/>,
            children: [
                {path: ":locationId/profile", element: <ChannelProfilePage/>},
                {path: ":locationId", element: <ChannelChatPage/>},
            ]
        }]
    )
}