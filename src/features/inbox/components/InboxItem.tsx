import {ChannelResponse} from "@features/channel/types/ChannelResponse.ts";
import {Link} from "react-router-dom";

type InboxItemProps = {
    inbox: ChannelResponse
};

export const InboxItem = ({inbox}: InboxItemProps) => {

    return (<Link to={`/inboxes/${inbox.id}`}>
            <li className="list-group-item" style={{height: '200px'}}>
                <div>{inbox.name}</div>
                <div>{inbox?.latestMessage?.content}</div>
            </li>
        </Link>
    )
}