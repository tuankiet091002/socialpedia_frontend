import {NotificationResponse} from "@features/notification/types/NotficationResponse.ts";
import emptyAvatar from "@assets/empty avatar.jpg";
import moment from "moment/moment";
import {Link} from "react-router-dom";
import clsx from "clsx";
import {NotificationType} from "@src/types.ts";
import {FaCircleDot, FaRegCircleDot} from "react-icons/fa6";
import {Button} from "@components/elements/Button.tsx";
import {useAcceptFriendRequestMutation, useRejectFriendRequestMutation} from "@features/auth/api.ts";

type NotificationItemProps = {
    data: NotificationResponse;
}


export const NotificationItem = ({data}: NotificationItemProps) => {

    const [acceptRequest, acceptResult] = useAcceptFriendRequestMutation();
    const [rejectRequest, rejectResult] = useRejectFriendRequestMutation();

    console.log(data.destination.split("/"));

    return (
        <li>
            <Link to={data.destination}
                  className={clsx("flex cursor-pointer flex-row items-center justify-between gap-x-4 rounded-sm p-2 hover:bg-gray-200", data.type != NotificationType.DONE && "border-2 border-blue-600")}>

                <img className="h-12 w-12 flex-none rounded-full bg-gray-50"
                     src={data.avatar?.url || emptyAvatar}
                     alt=""/>
                <div className="flex-auto gap-y-2 text-start max-w-[200px]">
                    <p className="truncate">{data.title}</p>
                    <p className="text-xs text-gray-500">{data.content}</p>
                    {
                        data.type == NotificationType.REQUEST && <div className="flex flex-row gap-x-2">
                            <Button type="button" className="px-0 text-xs w-[120px]"
                                    onClick={() => acceptRequest(Number(data.destination.split("/")[2]))}
                                    isLoading={acceptResult.isLoading}>
                                Chấp nhận
                            </Button>
                            <Button type="button" variant="danger" className="px-1 text-xs w-[120px]"
                                    onClick={() => rejectRequest(Number(data.destination.split("/")[2]))}
                                    isLoading={rejectResult.isLoading}>
                                Từ chối
                            </Button>
                        </div>
                    }
                </div>
                <p className="overflow-hidden whitespace-normal text-gray-500 text-[10px] w-[40px]">{data.createdDate ?
                    moment(data.createdDate).fromNow() : ""}</p>
                {data.type != NotificationType.DONE ? <FaCircleDot className="text-blue-600"/> :
                    <FaRegCircleDot className="text-gray-500"/>}
            </Link>
        </li>
    );
};