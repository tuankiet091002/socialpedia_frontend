import {ReactNode} from "react";

import {Link} from "react-router-dom";
import {ChannelResponse} from "@features/channels/types";

type ChannelItemProps = {
    children?: ReactNode
    channel: ChannelResponse
};
export const ChannelItem = ({channel}: ChannelItemProps) => {

    return (<Link to={`./${channel.id}`}>
            <li className="list-group-item" style={{height: '200px'}}>
                <div>{channel.name}</div>
                <div>{channel?.latestMessage?.content}</div>
            </li>
        </Link>
    )
}