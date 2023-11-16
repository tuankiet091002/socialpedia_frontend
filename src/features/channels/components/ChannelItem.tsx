import {ReactNode} from "react";
import {ChannelResponse} from "@features/channels";
import {Link} from "react-router-dom";

type ChannelItemProps = {
    children?: ReactNode
    channel: ChannelResponse
};
export const ChannelItem = ({channel}: ChannelItemProps) => {

    return (<Link to={`./${channel.id}`}>
            <li className="list-group-item" style={{height: '200px'}}>{channel.name}</li>
        </Link>
    )
}