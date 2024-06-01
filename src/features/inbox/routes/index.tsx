import {useRoutes} from "react-router-dom";
import {namedImport} from "@utils/namedImport.ts";
import {TwoSectionLayout} from "@components/layout/TwoSectionLayout.tsx";

const {InboxColumn} = namedImport(() => import("../components/InboxColumn.tsx"), "InboxColumn");
const {InboxDefaultNavigate} = namedImport(() => import("../components/InboxDefaultNavigate.tsx"), "InboxDefaultNavigate");
const {InboxChatPage} = namedImport(() => import("./InboxChatPage.tsx"), "InboxChatPage");
const {InboxProfilePage} = namedImport(() => import("./InboxProfilePage.tsx"), "InboxProfilePage");

export const InboxRoutes = () => {

    return useRoutes([
            {
                path: "*",
                element: <TwoSectionLayout navbar={<InboxColumn/>}/>,
                children: [
                    {path: ":locationId", element: <InboxChatPage/>},
                    {path: "*", element: <InboxDefaultNavigate/>}
                ]
            }
        ]
    )
}