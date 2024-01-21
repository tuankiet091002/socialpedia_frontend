import {SpaceItem} from "@features/message/components/SpaceItem.tsx";
import {useEffect, useRef, useState} from "react";
import {useGetInboxListQuery} from "@features/inbox/api.ts";
import {InboxQueryRequest, newInboxQueryRequest} from "@features/inbox/types/InboxQueryRequest.ts";
import {IoIosSearch} from "react-icons/io";
import {setScrollspy} from "@utils/setScrollspy.ts";

export const InboxList = () => {
    //// SETTING VARIABLE
    const [query, setQuery] = useState<InboxQueryRequest>(newInboxQueryRequest())
    // variable use for search
    const [name, setName] = useState<string | undefined>(undefined)
    // ref for scrollable div
    const listScrollRef = useRef<HTMLUListElement>(null);
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
            return setScrollspy<HTMLUListElement>(listScrollRef, true,
                () => data && !data.last && setQuery(query => ({
                    ...query,
                    pageSize: query.pageSize + 3
                })));
        }
        , [data]);

    // wait for next render when there is data
    if (!data) return null;

    return (<div className="grid grid-rows-[45px_586.6px]">
            <div className="mb-2 flex flex-row items-center bg-cyan-700 p-2">
                <input type="text" className="w-full inline appearance-none text-sm pl-2
                    pr-[25px] py-1 shadow-sm focus:outline-none placeholder-gray-400"
                       placeholder="Find"
                       onChange={(e) => setName(e.target.value)}/>
                <IoIosSearch className="text-xl text-gray-500 ml-[-25px]"/>
            </div>
            <ul className="overflow-y-auto divide-y divide-gray-200" ref={listScrollRef}>
                {data?.content.map(item => <SpaceItem key={item.id} type="inbox" data={item}/>)}
            </ul>
        </div>

    )
}