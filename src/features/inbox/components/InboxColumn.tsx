import {InboxColumnHeader} from "@features/inbox/components/InboxColumnHeader.tsx";
import {InboxList} from "@features/inbox/components/InboxList.tsx";
import {useEffect, useRef, useState} from "react";
import {ChannelQueryRequest} from "@features/channel/types/ChannelQueryRequest.ts";
import {useGetInboxListQuery} from "@features/inbox/api.ts";

const INITIAL_PAGE = 3

export const InboxColumn = () => {
//// SETTING VARIABLE
    // default query state without name field
    const initialState = {pageNo: 0, pageSize: INITIAL_PAGE, orderBy: "id" as const, orderDirection: "ASC" as const}
    const [query, setQuery] = useState<ChannelQueryRequest>(initialState)
    // variable use for search
    const [name, setName] = useState<string | undefined>(undefined)
    // ref for scrollable div
    const listScrollRef = useRef<HTMLDivElement>(null);
    // main data
    const {data} = useGetInboxListQuery(query);

    // only fetch using query after 500ms delay
    useEffect(() => {
        const timer = setTimeout(() => {
            // merge name into query
            setQuery(query => ({...query, name, pageNo: 0}))
        }, 500)

        return () => clearTimeout(timer);
    }, [name])

    // set up scrollspy
    useEffect(() => {
        const listScrollElement: HTMLDivElement | null = listScrollRef.current;

        if (listScrollElement) {
            const onScroll = () => {
                const {scrollTop, scrollHeight, clientHeight} = listScrollElement;
                const isNearBottom = scrollTop + clientHeight >= scrollHeight;

                if (data && isNearBottom && !data.last) {
                    setQuery(query => ({...query, pageSize: query.pageSize + INITIAL_PAGE}))
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

    return (<div className="h-100 container d-flex flex-column p-0">
        <div className="row g-0 " style={{height: "100px"}}>
            <InboxColumnHeader setName={setName}/>
        </div>
        <div className="row g-0 overflow-scroll" ref={listScrollRef} style={{height: "calc(100vh - 206px)"}}>
            <InboxList data={data}/>
        </div>
    </div>)
}