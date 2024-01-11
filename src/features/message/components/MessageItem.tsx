import moment from "moment";
import {MessageResponse} from "@features/message/types/MessageResponse.ts";
import emptyAvatar from "@assets/empty avatar.jpg";

type MessageProps = {
    data: MessageResponse
};

export const MessageItem = ({data}: MessageProps) => {

        return (<li className="flex flex-row items-center justify-between rounded-md bg-blue-600 p-2 h-[800px]">
                {typeof data.createdBy !== "string" ?
                    <div className="flex flex-row items-end gap-4">
                        <img className="h-12 w-12 rounded-full"
                             src={data.createdBy?.avatar?.url || emptyAvatar} alt=""/>
                        <div className="flex flex-col items-start">
                            <p className="text-white font-semibold">{data.createdBy.name}</p>
                            <div className="flex flex-row gap-x-2">
                                {data.resources?.map((res, idx) => <img key={idx} src={res.url} className="h-[100px]"
                                                                        alt=""/>)}
                            </div>
                            <p className="text-white">{data.content}</p>
                        </div>
                    </div>
                    : <p className="font-bold text-white">{data.content}</p>}
                <p className="text-gray-200">{moment(data.modifiedDate).fromNow()}</p>
            </li>
        )
            ;
    }
;