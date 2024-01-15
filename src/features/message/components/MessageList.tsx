import {MessageItem} from "@features/message/components/MessageItem.tsx";
import {Dispatch, SetStateAction, useEffect, useRef} from "react";
import {MessageQueryRequest} from "@features/message/types/MessageQueryRequest.ts";
import {UseQuery} from "@reduxjs/toolkit/dist/query/react/buildHooks";
import {BaseQueryFn, FetchArgs, FetchBaseQueryError, QueryDefinition} from "@reduxjs/toolkit/query";
import {MessageResponse} from "@features/message/types/MessageResponse.ts";
import {Page} from "@src/types.ts";
import {useParams} from "react-router-dom";
import {setScrollspy} from "@utils/setScrollspy.ts";

export type MessageListProps = {
    queryFunc: UseQuery<QueryDefinition<
        MessageQueryRequest,
        BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
        "Message",
        Page<MessageResponse>,
        "message">>;
    query: MessageQueryRequest
    setQuery: Dispatch<SetStateAction<MessageQueryRequest>>
}

const INITIAL_PAGE = 10;

export const MessageList = ({queryFunc, query, setQuery}: MessageListProps) => {
    //// SETTING VARIABLE
    // get location id
    const {locationId: locationNum} = useParams();
    const locationId = Number(locationNum);

    // ref for scrollable div
    const listScrollRef = useRef<HTMLUListElement>(null);

    // map to get each space's last page size
    const map = useRef(new Map<number, number>());
    useEffect(() => {
        // get value in map, or else fetch first page
        const pageSize = map.current.get(locationId) || INITIAL_PAGE;
        setQuery(query => ({...query, locationId, pageSize: pageSize}));
    }, [locationId, setQuery]);

    const {data} = queryFunc(query);

    // set up scrollspy
    useEffect(() => {
            return setScrollspy<HTMLUListElement>(listScrollRef, false,
                () => {
                    if (data && !data.last) {
                        const newSize = query.pageSize + INITIAL_PAGE;
                        map.current.set(locationId, newSize);
                        setQuery(query => ({...query, pageSize: newSize}));
                    }
                });
        }
        , [data, locationId, query.pageSize, setQuery]);

    // wait for next render when there is data
    if (!data) return null;

    return (
        <ul className="overflow-y-auto p-2 h-[calc(100vh-178px)] space-y-2" ref={listScrollRef}>
            {data?.content.slice().reverse().map(item => <MessageItem key={item.id} data={item}/>)}
        </ul>
    );
};