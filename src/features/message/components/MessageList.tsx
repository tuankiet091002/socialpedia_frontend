import {MessageItem} from "@features/message/components/MessageItem.tsx";
import {useEffect, useRef} from "react";
import {MessageQueryRequest} from "@features/message/types/MessageQueryRequest.ts";
import {setScrollspy} from "@utils/setScrollspy.ts";
import {useDispatch} from "react-redux";
import {messageQueryChange} from "@utils/querySlice.ts";
import {Spinner} from "@components/elements/Spinner.tsx";
import {useGetMessageFromChannelQuery, useGetMessageFromInboxQuery} from "@features/message/api.ts";

export type MessageListProps = {
    type: "channel" | "inbox"
    query: MessageQueryRequest
}

export const MessageList = ({type, query}: MessageListProps) => {
    //// SETTING VARIABLE
    const dispatch = useDispatch();
    // ref for scrollable div
    const listScrollRef = useRef<HTMLUListElement>(null);

    const queryFunc = type == "channel" ? useGetMessageFromChannelQuery : useGetMessageFromInboxQuery;
    const {data, isFetching} = queryFunc(query);

    // set up scrollspy
    useEffect(() => {
        return setScrollspy<HTMLUListElement>(listScrollRef, false,
            () => data && !data.last &&
                dispatch(messageQueryChange({...query, pageNo: query.pageNo + 1})))
    }, [data]);

    // wait for next render when there is data
    if (!data) return null;

    return (
        <ul className="overflow-y-auto p-2 h-[567.6px] space-y-1" ref={listScrollRef}>
            {isFetching && <Spinner className="mx-auto" size="lg"/>}
            {data?.content.slice().reverse().map(item => <MessageItem key={item.id} data={item}/>)}
        </ul>
    );
};