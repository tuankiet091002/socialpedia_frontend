import {MessageQueryRequest, useGetMessagesQuery} from "@features/messages";
import {useParams} from "react-router-dom";
import {Message} from "@features/messages/components/Message.tsx";
import {useEffect, useRef, useState} from "react";

export const MessageList = () => {
    //// SETTING VARIABLE
    // get current channelId as number
    const {channelId} = useParams();
    const channelNum = +(channelId as string);
    // default query state without name field
    const initialState = {channel: +(channelId as string), pageNo: 0, pageSize: 3}
    const [query, setQuery] = useState<MessageQueryRequest>(initialState)
    // set state when url change
    // map to get each channel last page Number
    const map = useRef(new Map<number, number>());
    useEffect(() => {
        // get value in map, or else fetch first page
        const pageNo = map.current.get(channelNum) || 0;
        setQuery(query => ({...query, channel: channelNum, pageNo: pageNo}))
    }, [channelId]);
    // ref for scrollable div
    const listScrollRef = useRef<HTMLUListElement>(null);

    const {data} = useGetMessagesQuery(query)

    // set up scrollspy
    useEffect(() => {
        const listScrollElement: HTMLUListElement | null = listScrollRef.current;

        if (listScrollElement) {
            (listScrollElement.lastChild as HTMLLIElement).scrollIntoView();
            const onScroll = () => {
                console.log('check')
                if (data && listScrollElement.scrollTop == 0 && !data.last) {
                    console.log("vao day ko")
                    map.current.set(channelNum, query.pageNo + 1)
                    setQuery(query => ({...query, pageNo: query.pageNo + 1}))
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
        <ul className="list-unstyled mb-0 overflow-scroll" ref={listScrollRef}>
            {data?.content.slice().reverse().map(item => <Message key={item.id} content={item}/>)}
        </ul>
    )
}