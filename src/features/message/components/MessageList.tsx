import {MessageItem} from "@features/message/components/MessageItem.tsx";
import {useEffect, useRef} from "react";
import {MessageQueryRequest} from "@features/message/types/MessageQueryRequest.ts";
import {UseQuery} from "@reduxjs/toolkit/dist/query/react/buildHooks";
import {BaseQueryFn, FetchArgs, FetchBaseQueryError, QueryDefinition} from "@reduxjs/toolkit/query";
import {MessageResponse} from "@features/message/types/MessageResponse.ts";
import {Page} from "@src/types.ts";
import {setScrollspy} from "@utils/setScrollspy.ts";
import {useDispatch} from "react-redux";
import {messageQueryChange} from "@src/querySlice.ts";

export type MessageListProps = {
    queryFunc: UseQuery<QueryDefinition<
        MessageQueryRequest,
        BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
        "Message",
        Page<MessageResponse>,
        "message">>;
    query: MessageQueryRequest
}

export const MessageList = ({queryFunc, query}: MessageListProps) => {
    //// SETTING VARIABLE
    const dispatch = useDispatch();
    // ref for scrollable div
    const listScrollRef = useRef<HTMLUListElement>(null);

    const {data} = queryFunc(query);

    // set up scrollspy
    useEffect(() => {
        return setScrollspy<HTMLUListElement>(listScrollRef, true,
            () => data && !data.last &&
                dispatch(messageQueryChange({...query, pageNo: query.pageNo + 1})))
    }, [data]);

    // wait for next render when there is data
    if (!data) return null;

    return (
        <ul className="overflow-y-auto p-2 h-[calc(100vh-178px)] space-y-2" ref={listScrollRef}>
            {data?.content.slice().reverse().map(item => <MessageItem key={item.id} data={item}/>)}
        </ul>
    );
};