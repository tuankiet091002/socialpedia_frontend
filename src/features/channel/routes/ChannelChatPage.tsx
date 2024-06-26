import {Head} from "@components/elements/Head.tsx";
import {Link, useParams} from "react-router-dom";
import {useGetChannelProfileQuery} from "@features/channel/api.ts";
import {MessageList} from "@features/message/components/MessageList.tsx";
import {useSendMessageToChannelMutation} from "@features/message/api.ts";
import {IoFilter} from "react-icons/io5";
import {IoIosSearch} from "react-icons/io";
import {MessageInput} from "@features/message/components/MessageInput.tsx";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@src/main.tsx";
import {messageQueryChange} from "@utils/querySlice.ts";
import {Avatar} from "@components/elements/Avatar.tsx";
import {MessageResponse} from "@features/message/types/MessageResponse.ts";
import {useGetChannelRelationQuery} from "@features/auth/api.ts";
import {PermissionAccessType} from "@src/types.ts";

export const ChannelChatPage = () => {
    //// SETTING VARIABLES
    // get current locationId as number
    const {locationId: locationNum} = useParams();
    const locationId = Number(locationNum);
    // get query, or else insert new query
    const dispatch = useDispatch();
    const query = useSelector((state: RootState) => state.query.messageQuery.find(m => m.locationId == locationId));
    if (!query) dispatch(messageQueryChange({locationId, content: "", pageNo: 0, pageSize: 7}))
    const [content, setContent] = useState<string>("");
    // state for reply target
    const [reply, setReply] = useState<MessageResponse | null>(null);

    const switchReply = (m: MessageResponse) => {
        setReply(reply ? null : m)
    }

    // main data
    const {data} = useGetChannelProfileQuery(locationId);
    const {data: member} = useGetChannelRelationQuery(locationId);

    // only fetch using query after 500ms delay
    useEffect(() => {
        const timer = setTimeout(() => {
            // merge name into query
            dispatch(messageQueryChange({...query!, pageNo: 0, content}))
        }, 500);

        return () => clearTimeout(timer);
    }, [content]);

    if (!data) return null;


    return (<>
        <Head title={`${data.name}`}/>
        <div className="flex h-full flex-col bg-gray-100">
            <section
                className="flex items-center justify-between border border-gray-300 px-3 h-[60px]">
                <div className="flex flex-row items-center gap-x-4">
                    <Avatar src={data.avatar?.url} size="sm"/>
                    <Link to={`/channel/${data.id}/profile`}
                          className="cursor-pointer truncate text-start text-3xl hover:text-blue-500">
                        {data.name}
                    </Link>
                </div>

                <div className="flex items-center text-start shadow-2xl">
                    <IoFilter className="mr-3 inline"/>
                    <span className="mr-3">Filter:</span>
                    <div className="flex flex-row items-center">
                        <input type="text" className="w-full inline appearance-none text-sm pl-2
                    pr-[25px] py-1 shadow-sm rounded-md border border-gray-300 focus:outline-none placeholder-gray-400"
                               placeholder="Find"
                               onChange={e => setContent(e.target.value)}/>
                        <IoIosSearch className="text-xl text-gray-500 ml-[-25px]"/>
                    </div>
                </div>
            </section>
            <section className="flex-auto">
                <MessageList type="channel" query={query!} setReply={switchReply}
                             editPermission={member ? Number(PermissionAccessType[member.messagePermission]) >= PermissionAccessType.MODIFY : false}/>
            </section>
            <section className="h-[50px]">
                <MessageInput queryFunc={useSendMessageToChannelMutation} reply={reply}
                              setReply={switchReply}
                              writePermission={member ? Number(PermissionAccessType[member.messagePermission]) >= PermissionAccessType.CREATE : false}/>
            </section>
        </div>
    </>);
};