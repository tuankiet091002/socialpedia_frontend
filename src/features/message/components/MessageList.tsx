import {useParams} from "react-router-dom";
import {MessageItem} from "@features/message/components/MessageItem.tsx";
import {useEffect, useRef, useState} from "react";
import {MessageQueryRequest} from "@features/message/types/MessageQueryRequest.ts";
import {UseQuery} from "@reduxjs/toolkit/dist/query/react/buildHooks";
import {BaseQueryFn, FetchArgs, FetchBaseQueryError, QueryDefinition} from "@reduxjs/toolkit/query";
import {MessageResponse} from "@features/message/types/MessageResponse.ts";
import {Page} from "@src/types.ts";

export type MessageListProps = {
    queryFunc: UseQuery<QueryDefinition<
        MessageQueryRequest,
        BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
        "Message",
        Page<MessageResponse>,
        "message">>;
}

const INITIAL_PAGE = 3;

export const MessageList = ({queryFunc}: MessageListProps) => {
    //// SETTING VARIABLE
    // get current channelId as number
    const {locationId: locationNum} = useParams();
    const locationId = Number(locationNum);
    // default query state without name field
    const initialState = {locationId, pageNo: 0, pageSize: INITIAL_PAGE};
    const [query, setQuery] = useState<MessageQueryRequest>(initialState);
    // ref for scrollable div
    const listScrollRef = useRef<HTMLUListElement>(null);

    // map to get each space's last page size
    const map = useRef(new Map<number, number>());
    useEffect(() => {
        // get value in map, or else fetch first page
        const pageSize = map.current.get(locationId) || INITIAL_PAGE;
        setQuery(query => ({...query, locationId, pageSize: pageSize}));
    }, [locationId]);

    const {data} = queryFunc(query);

    // set up scrollspy
    useEffect(() => {
        const listScrollElement: HTMLUListElement | null = listScrollRef.current;

        if (listScrollElement) {
            // scroll to bottom in the first time
            if (data?.size === INITIAL_PAGE) {
                listScrollElement.scrollTo(0, listScrollElement.scrollHeight);
            } else {
                // scroll to previous location in next time
                listScrollElement.scrollTo(0, data ? (INITIAL_PAGE) * 200 : 0);
            }
            // try to fetch new data if scroll to the top
            const onScroll = () => {
                if (listScrollElement.scrollTop == 0 && data && !data.last) {
                    const newSize = query.pageSize + INITIAL_PAGE;
                    map.current.set(locationId, newSize);
                    setQuery(query => ({...query, pageSize: newSize}));
                }
            };
            listScrollElement.addEventListener("scroll", onScroll);
            // clean-up
            return () => {
                listScrollElement.removeEventListener("scroll", onScroll);
            };
        }
    }, [data]);

    // wait for next render when there is data
    if (!data) return null;

    return (
        <ul className="overflow-y-auto p-2 h-[571.6px] space-y-2" ref={listScrollRef}>
            {data?.content.slice().reverse().map(item => <MessageItem key={item.id} data={item}/>)}
        </ul>
    );
};