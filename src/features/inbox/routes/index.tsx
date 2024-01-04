import {useRoutes} from "react-router-dom";
import {MessagesLayout} from "@features/message/components/MessagesLayout.tsx";
import {namedImport} from "@utils/namedImport.ts";

const {InboxColumn} = namedImport(() => import("../components/InboxColumn.tsx"), "InboxColumn");
const {InboxChatPage} = namedImport(() => import("./InboxChatPage.tsx"), "InboxChatPage");
const {InboxProfilePage} = namedImport(() => import("./InboxProfilePage.tsx"), "InboxProfilePage");

export const InboxRoutes = () => {

    return useRoutes([
            {
                path: '*',
                element: <MessagesLayout title={"Messages"} column={<InboxColumn/>}/>,
                children: [
                    {path: ':locationId/profile', element: <InboxProfilePage/>},
                    {path: ':locationId', element: <InboxChatPage/>},
                    {path: "*", element: <div>Wrong site</div>}
                ],
            },
        ]
    )
}