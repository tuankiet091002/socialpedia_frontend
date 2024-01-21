import {ChannelResponse} from "@features/channel/types/ChannelResponse.ts";
import {useNavigate} from "react-router-dom";
import moment from "moment";
import {InboxResponse} from "@features/inbox/types/InboxResponse.ts";
import {Avatar} from "@components/elements/Avatar.tsx";

type ChannelItemProps = {
    data: ChannelResponse | InboxResponse;
    type: "channel" | "inbox";
};

export const SpaceItem = ({data, type}: ChannelItemProps) => {
    const navigate = useNavigate();

    return (
        <li className="flex cursor-pointer flex-row items-center justify-between gap-x-4 p-2 h-[500px] hover:bg-blue-400 hover:text-white"
            onClick={() => navigate(`/${type}/${data.id}`)}>
            <Avatar className="bg-gray-50" src={data.avatar?.url} size="sm"/>
            <div className="flex-auto text-start max-w-[170px]">
                <p className="truncate">{data.name}</p>
                <p className="mt-1 truncate text-xs text-gray-500">{data.latestMessage?.content}</p>
            </div>
            <p className="overflow-hidden whitespace-normal text-gray-500 text-[10px] min-w-[40px]">{data.latestMessage ?
                moment(data.latestMessage.modifiedDate).fromNow() : ""}</p>
        </li>
    );
};