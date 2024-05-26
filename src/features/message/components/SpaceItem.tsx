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
        <li className="flex cursor-pointer flex-row items-center justify-between gap-x-4 p-2 group hover:bg-blue-500 hover:text-white"
            onClick={() => navigate(`/${type}/${data.id}`)}>
            <Avatar className="bg-gray-50" src={data.avatar?.url} size="sm"/>
            <div className="flex-auto text-start max-w-[170px]">
                <p className="truncate">{data.name}</p>
                {type == "inbox" &&
                    <div className="text-sm">With:&nbsp;
                        <span className="text-blue-500 group-hover:text-white"
                              onClick={(event) => {
                                  event.stopPropagation();
                                  navigate(`/user/${(data as InboxResponse).contactWith!.id}`)
                              }}>{(data as InboxResponse).contactWith!.name}</span>
                    </div>}
                <p className="mt-1 truncate text-xs text-gray-400 group-hover:text-white">{data.latestMessage?.content}</p>
            </div>
            <p className="overflow-hidden whitespace-normal text-gray-500 text-[10px] min-w-[40px] group-hover:text-white">
                {data.latestMessage ? moment(data.latestMessage.modifiedDate).fromNow() : ""}</p>
        </li>
    );
};