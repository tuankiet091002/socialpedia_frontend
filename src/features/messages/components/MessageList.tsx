import {MessageQueryRequest, useGetMessagesQuery} from "@features/messages";
import {useParams} from "react-router-dom";
import {Message} from "@features/messages/components/Message.tsx";
import {useEffect, useRef, useState} from "react";

const INITIAL_PAGE = 3

export const MessageList = () => {
    //// SETTING VARIABLE
    // get current channelId as number
    const {channelId} = useParams();
    const channelNum = +(channelId as string)
    // default query state without name field
    const initialState = {channel: channelNum, pageNo: 0, pageSize: INITIAL_PAGE}
    const [query, setQuery] = useState<MessageQueryRequest>(initialState)
    // ref for scrollable div
    const listScrollRef = useRef<HTMLUListElement>(null);
    // map to get each channel last page size
    const map = useRef(new Map<number, number>());
    useEffect(() => {
        // get value in map, or else fetch first page
        const pageSize = map.current.get(channelNum) || INITIAL_PAGE;
        setQuery(query => ({...query, channel: channelNum, pageSize: pageSize}))
    }, [channelNum]);

    const {data} = useGetMessagesQuery(query)

    // set up scrollspy
    useEffect(() => {
        const listScrollElement: HTMLUListElement | null = listScrollRef.current;

        if (listScrollElement) {
            // scroll to bottom in the first time
            if (data?.size === INITIAL_PAGE) {
                listScrollElement.scrollTo(0, listScrollElement.scrollHeight)
            } else {
                // scroll to previous location in next time
                listScrollElement.scrollTo(0, data ? (INITIAL_PAGE) * 200 : 0)
            }
            // try to fetch new data if scroll to the top
            const onScroll = () => {
                if (listScrollElement.scrollTop == 0 && data && !data.last) {
                    const newSize = query.pageSize + INITIAL_PAGE;
                    map.current.set(channelNum, newSize)
                    setQuery(query => ({...query, pageSize: newSize}));
                }
            }
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
        <ul className="list-unstyled mb-0 overflow-scroll h-100" ref={listScrollRef}>
            {data?.content.slice().reverse().map(item => <Message key={item.id} content={item}/>)}
        </ul>
    )
}