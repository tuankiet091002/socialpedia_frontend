import {IoIosSearch} from "react-icons/io";
import {useEffect, useRef, useState} from "react";
import {useGetPersonalChannelListQuery} from "@features/channel/api.ts";
import {SpaceItem} from "@features/message/components/SpaceItem.tsx";
import {setScrollspy} from "@utils/setScrollspy.ts";
import {RootState} from "@src/main.tsx";
import {useDispatch, useSelector} from "react-redux";
import {channelQueryChange} from "@src/querySlice.ts";

export const PersonalChannelList = () => {
    //// SETTING VARIABLE
    // get query from slice
    const dispatch = useDispatch();
    const query = useSelector((state: RootState) => state.query.channelQuery)
    const [name, setName] = useState<string>("");
    // ref for scrollable div
    const listScrollRef = useRef<HTMLUListElement>(null);
    // main data
    const {data} = useGetPersonalChannelListQuery(query);

    // only fetch using query after 500ms delay
    useEffect(() => {
        const timer = setTimeout(() => {
            // merge name into query
            dispatch(channelQueryChange({...query, name: name}))
        }, 500);

        return () => clearTimeout(timer);
    }, [name]);

    // set up scrollspy
    useEffect(() => {
        return setScrollspy<HTMLUListElement>(listScrollRef, true,
            () => data && !data.last &&
                dispatch(channelQueryChange({...query, pageNo: query.pageNo + 1})))
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
    );
};