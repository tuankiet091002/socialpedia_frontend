import {NotificationResponse} from "@features/notification/types/NotficationResponse.ts";
import emptyAvatar from "@assets/empty avatar.jpg";
import moment from "moment/moment";

type NotificationItemProps = {
    data: NotificationResponse;
}

export const NotificationItem = ({data}: NotificationItemProps) => {

    return (
        <li className="flex cursor-pointer flex-row items-center justify-between gap-x-4 rounded-md border-blue-400 p-2 hover:border h-[200px]">
            <img className="h-12 w-12 flex-none rounded-full bg-gray-50"
                 src={data.avatar?.url || emptyAvatar}
                 alt=""/>
            <div className="flex-auto text-start max-w-[170px]">
                <p className="truncate">{data.title}</p>
                <p className="mt-1 truncate text-xs text-gray-500">{data.content}</p>
            </div>
            <p className="overflow-hidden whitespace-normal text-gray-500 text-[10px] min-w-[40px]">{data.createdDate ?
                moment(data.createdDate).fromNow() : ""}</p>
        </li>
    );
};