import {useRoutes} from "react-router-dom";

import {MessagesLayout} from "@features/messages/components/MessagesLayout.tsx";
import {namedImport} from "@utils/namedImport.ts";

const {Messages} = namedImport(() => import("./Messages.tsx"), "Messages");

export const MessagesRoutes = () => {

    return useRoutes([
            {
                path: '*',
                element: <MessagesLayout title={"Messages"}/>,
                children: [
                    {path: ':channelId', element: <Messages/>},
                    {path: "*", element: <div>Wrong site</div>}
                ],
            },
        ]
    )
}