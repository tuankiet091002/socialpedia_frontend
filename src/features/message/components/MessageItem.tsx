import moment from "moment";
import {MessageResponse} from "@features/message/types/MessageResponse.ts";
import {Avatar} from "@components/elements/Avatar.tsx";

type MessageProps = {
    data: MessageResponse
};

export const MessageItem = ({data}: MessageProps) => {

        return (<li className="relative flex flex-row items-center justify-between rounded-md bg-blue-600 p-2 group">
                {typeof data.createdBy !== "string" ?
                    <div className="flex flex-row items-end gap-4">
                        <Avatar src={data.createdBy?.avatar?.url} size="sm"/>
                        <div className="flex flex-col items-start">
                            <p className="font-semibold text-white">{data.createdBy.name}</p>
                            <div className="flex flex-row gap-x-2">
                                {data.resources?.map((res, idx) =>
                                    <Avatar key={idx} src={res.url} size="md" className="!rounded-none !w-auto"/>)}
                            </div>
                            <p className="text-white">{data.content}</p>
                        </div>
                    </div>
                    : <p className="font-bold text-white">{data.content}</p>}
                <p className="text-gray-200">{moment(data.modifiedDate).fromNow()}</p>
                <div className="absolute right-2 hidden bg-red-500 top-[-10px] group-hover:block">abc</div>
            </li>
        );
    }
;