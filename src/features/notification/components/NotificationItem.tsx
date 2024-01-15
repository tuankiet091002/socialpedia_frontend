import {NotificationResponse} from "@features/notification/types/NotficationResponse.ts";
import emptyAvatar from "@assets/empty avatar.jpg";
import moment from "moment/moment";
import {Link} from "react-router-dom";
import clsx from "clsx";
import {NotificationType} from "@src/types.ts";
import {FaCircleDot, FaRegCircleDot} from "react-icons/fa6";
import {Button} from "@components/elements/Button.tsx";
import {useAcceptFriendRequestMutation, useRejectFriendRequestMutation} from "@features/auth/api.ts";
import {useAcceptChannelRequestMutation, useRejectChannelRequestMutation} from "@features/channel/api.ts";
import {MouseEventHandler} from "react";

type NotificationItemProps = {
    data: NotificationResponse;
}

export const NotificationItem = ({data}: NotificationItemProps) => {

    const [acceptFriendRequest, acceptFriendResult] = useAcceptFriendRequestMutation();
    const [rejectFriendRequest, rejectFriendResult] = useRejectFriendRequestMutation();
    const [acceptMemberRequest, acceptMemberResult] = useAcceptChannelRequestMutation();
    const [rejectMemberRequest, rejectMemberResult] = useRejectChannelRequestMutation();

    // use function base on destination string
    const destinationArray = data.destination.split("/");
    let acceptFunc: unknown, rejectFunc: unknown, acceptResult: unknown, rejectResult: unknown;
    switch (destinationArray[1]) {
        // friend request
        case "user":
            acceptFunc = () => acceptFriendRequest(Number(destinationArray[2]));
            acceptResult = acceptFriendResult;
            rejectFunc = () => rejectFriendRequest(Number(destinationArray[2]));
            rejectResult = rejectFriendResult;
            break;
        // channel request
        case "channel":
            acceptFunc = () => acceptMemberRequest({
                channelId: Number(destinationArray[2]),
                memberId: Number(destinationArray[2])
            }).unwrap().then();
            acceptResult = acceptMemberResult;
            rejectFunc = () => rejectMemberRequest({
                channelId: Number(destinationArray[2]),
                memberId: Number(destinationArray[4])
            });
            rejectResult = rejectMemberResult;
            break;
        default:
            break;
    }

    return (
        <li>
            <Link to={data.destination}
                  className={clsx("flex cursor-pointer flex-row items-center justify-between gap-x-2 rounded-sm p-2 hover:bg-gray-200", data.type != NotificationType.DONE && "border-2 border-blue-600")}>

                <img className="h-12 w-12 flex-none rounded-full bg-gray-50"
                     src={data.avatar?.url || emptyAvatar}
                     alt=""/>
                <div className="flex-auto gap-y-2 text-start max-w-[210px]">
                    <p className="truncate">{data.title}</p>
                    <p className="text-xs text-gray-500">{data.content}</p>
                    {
                        data.type == NotificationType.REQUEST && <div className="flex flex-row gap-x-2">
                            <Button type="button" size="sm" className="!px-2 text-xs"
                                    onClick={acceptFunc as MouseEventHandler<HTMLButtonElement>}
                                    isLoading={(acceptResult as { isLoading: boolean }).isLoading}>
                                Chấp nhận
                            </Button>
                            <Button type="button" variant="danger" size="sm" className="!px-2 text-xs"
                                    onClick={rejectFunc as MouseEventHandler<HTMLButtonElement>}
                                    isLoading={(rejectResult as { isLoading: boolean }).isLoading}>
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