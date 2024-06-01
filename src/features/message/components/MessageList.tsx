import React, {useEffect, useRef} from "react";
import {MessageQueryRequest} from "@features/message/types/MessageQueryRequest.ts";
import {setScrollspy} from "@utils/setScrollspy.ts";
import {useDispatch} from "react-redux";
import {messageQueryChange} from "@utils/querySlice.ts";
import {useGetMessageFromChannelQuery, useGetMessageFromInboxQuery} from "@features/message/api.ts";
import {UserResponse} from "@features/user/types";
import {sendTo} from "@utils/socketMessage.ts";
import {useParams} from "react-router-dom";
import {SocketType} from "@src/types.ts";
import {Spinner} from "@components/elements/Spinner.tsx";
import {MessageItem} from "@features/message/components/MessageItem.tsx";
import {Avatar} from "@components/elements/Avatar.tsx";
import {useAuth} from "@src/hooks/useAuth.ts";
import {MessageResponse} from "@features/message/types/MessageResponse.ts";

export type MessageListProps = {
    type: "channel" | "inbox"
    query: MessageQueryRequest
    seenId?: number
    seenUser?: UserResponse
    setReply?: (m: MessageResponse) => void
    editPermission: boolean
}

export const MessageList = ({type, query, seenId, seenUser, setReply, editPermission}: MessageListProps) => {
    //// SETTING VARIABLE
    const dispatch = useDispatch();
    const {locationId} = useParams();
    // ref for scrollable div
    const listScrollRef = useRef<HTMLUListElement>(null);

    const queryFunc = type == "channel" ? useGetMessageFromChannelQuery : useGetMessageFromInboxQuery;
    const {data, isFetching} = queryFunc(query);
    const {data: owner} = useAuth();

    useEffect(() => {
        // scroll to bottom when change site
        if (listScrollRef.current) {
            listScrollRef.current.scrollTo(0, listScrollRef.current.scrollHeight);
        }
    }, [locationId]);


    // scroll down a little
    useEffect(() => {
        if (listScrollRef.current) {
            listScrollRef.current.scrollTo(0, 200);
        }
    }, [query]);

    // set up scrollspy
    useEffect(() => {
        // send seen signal to
        if (type == "inbox" && (!query.content || !query.content.length)) {
            sendTo(`space/${locationId}`, SocketType.SEEN, {
                id: owner!.id,
                name: owner!.name
            }).then()
        }

        return setScrollspy<HTMLUListElement>(listScrollRef, false,
            () => data && !data.last &&
                dispatch(messageQueryChange({...query, pageNo: query.pageNo + 1})))
    }, [data]);

    // wait for next render when there is data
    if (!data) return null;

    return (
        <ul className="overflow-y-auto p-2 h-[567.6px] space-y-1" ref={listScrollRef}>
            {isFetching && <Spinner className="mx-auto" size="lg"/>}
            {data?.content.slice().reverse().map(item => <React.Fragment key={item.id}>
                <MessageItem data={item} type={type} setReply={setReply}
                             permission={editPermission}/>
                {seenId && item.id == seenId &&
                    <p className="text-end">
                        <Avatar src={seenUser!.avatar?.url} className="inline-block w-[20px] h-[20px] me-2"/>
                        {seenUser!.name} has seen this message
                    </p>}
            </React.Fragment>)}
        </ul>
    );
};