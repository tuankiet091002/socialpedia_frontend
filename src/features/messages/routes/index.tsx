import {useRoutes} from "react-router-dom";
import {Messages} from "@features/messages/routes/Messages.tsx";
import {MessagesLayout} from "@features/messages/components";

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