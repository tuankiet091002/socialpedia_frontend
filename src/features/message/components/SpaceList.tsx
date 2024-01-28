import {SpaceItem} from "@features/message/components/SpaceItem.tsx";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@src/main.tsx";
import {useEffect, useRef, useState} from "react";
import {channelQueryChange, inboxQueryChange} from "@utils/querySlice.ts";
import {setScrollspy} from "@utils/setScrollspy.ts";
import {IoIosSearch} from "react-icons/io";
import {ChannelQueryRequest} from "@features/channel/types/ChannelQueryRequest.ts";
import {InboxQueryRequest} from "@features/inbox/types/InboxQueryRequest.ts";
import {Spinner} from "@components/elements/Spinner.tsx";
import {useGetPersonalChannelListQuery} from "@features/channel/api.ts";
import {useGetInboxListQuery} from "@features/inbox/api.ts";

type SpaceListProps = {
    type: "channel" | "inbox",
}

export const SpaceList = ({type}: SpaceListProps) => {
    //// SETTING VARIABLE
    // get query from slice
    const dispatch = useDispatch();
    const query = useSelector((state: RootState) => type == "channel" ? state.query.channelQuery : state.query.inboxQuery)
    const [name, setName] = useState<string>("");
    // ref for scrollable div
    const listScrollRef = useRef<HTMLUListElement>(null);
    // main data
    const queryFunc = type == "channel" ? useGetPersonalChannelListQuery : useGetInboxListQuery;
    const {data, isFetching} = queryFunc(query);

    const queryChange = (query: ChannelQueryRequest | InboxQueryRequest) => {
        return type == "channel" ? channelQueryChange(query)
            : inboxQueryChange(query)
    }

    // only fetch using query after 500ms delay
    useEffect(() => {
        const timer = setTimeout(() => {
            // merge name into query
            dispatch(queryChange({...query, name: name}))
        }, 500);

        return () => clearTimeout(timer);
    }, [name]);

    // set up scrollspy
    useEffect(() => {
            return setScrollspy<HTMLUListElement>(listScrollRef, true,
                () => data && !data.last && dispatch(queryChange({...query, pageNo: query.pageNo + 1})))
        }
        , [data]);

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
                {isFetching && <div><Spinner size="lg" className="mx-auto"/></div>}
            </ul>
        </div>
    );
}