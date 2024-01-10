import {IoIosSearch} from "react-icons/io";
import {useEffect, useRef, useState} from "react";
import {ChannelQueryRequest} from "@features/channel/types/ChannelQueryRequest.ts";
import {useGetPersonalChannelListQuery} from "@features/channel/api.ts";
import {SpaceItem} from "@features/message/components/SpaceItem.tsx";

const INITIAL_PAGE = 3

export const PersonalChannelList = () => {
    //// SETTING VARIABLE
    // default query state without name field
    const initialState = {pageNo: 0, pageSize: INITIAL_PAGE, orderBy: "id" as const, orderDirection: "ASC" as const}
    const [query, setQuery] = useState<ChannelQueryRequest>(initialState)
    // variable use for search
    const [name, setName] = useState<string | undefined>(undefined)
    // ref for scrollable div
    const listScrollRef = useRef<HTMLUListElement>(null);
    // main data
    const {data} = useGetPersonalChannelListQuery(query);

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
        const listScrollElement: HTMLUListElement | null = listScrollRef.current;

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

    return (<div className="grid grid-rows-[45px_536.6px]">
            <div className="mb-2 flex flex-row items-center bg-cyan-700 p-2">
                <input type="text" className="w-full inline appearance-none text-sm pl-2
                    pr-[25px] py-1 shadow-sm focus:outline-none placeholder-gray-400"
                       placeholder="Find"
                       onChange={(e) => setName(e.target.value)}/>
                <IoIosSearch className="text-xl text-gray-500 ml-[-25px]"/>
            </div>
            <ul className="overflow-y-scroll divide-y divide-gray-200" ref={listScrollRef}>
                {data?.content.map(item => <SpaceItem key={item.id} type="channel" data={item}/>)}
            </ul>
        </div>
    )
}