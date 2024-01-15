import {Head} from "@components/elements/Head.tsx";
import {useParams} from "react-router-dom";
import {useGetChannelProfileQuery} from "@features/channel/api.ts";
import emptyAvatar from "@assets/empty avatar.jpg";
import {MessageList} from "@features/message/components/MessageList.tsx";
import {useGetMessageFromChannelQuery, useSendMessageToChannelMutation} from "@features/message/api.ts";
import {IoFilter} from "react-icons/io5";
import {IoIosSearch} from "react-icons/io";
import {MessageInput} from "@features/message/components/MessageInput.tsx";
import {useState} from "react";
import {MessageQueryRequest} from "@features/message/types/MessageQueryRequest.ts";


const INITIAL_PAGE = 10;

export const ChannelChatPage = () => {
    // get current locationId as number
    const {locationId: locationNum} = useParams();
    const locationId = Number(locationNum);
    // default query state without name field
    const initialState = {locationId, pageNo: 0, pageSize: INITIAL_PAGE};
    const [query, setQuery] = useState<MessageQueryRequest>(initialState);

    // main data
    const {data} = useGetChannelProfileQuery(Number(locationId));
    if (!data) return null;


    return (<>
        <Head title={`${data.name}`}/>
        <div className="flex h-full flex-col">
            <section
                className="flex items-center justify-between border border-gray-300 bg-white px-3 shadow-2xl h-[60px]">
                <div className="flex flex-row items-center gap-x-4">
                    <img className="h-10 w-10 rounded-full" src={data.avatar?.url || emptyAvatar} alt=""/>
                    <span className="text-start text-3xl">{data.name}</span>
                </div>

                <div className="flex items-center text-start shadow-2xl">
                    <IoFilter className="mr-3 inline"/>
                    <span className="mr-3">Filter:</span>
                    <div className="flex flex-row items-center">
                        <input type="text" className="w-full inline appearance-none text-sm pl-2
                    pr-[25px] py-1 shadow-sm rounded-md border border-gray-300 focus:outline-none placeholder-gray-400"
                               placeholder="Find"
                               onChange={e => setQuery({...initialState, content: e.target.value})}/>
                        <IoIosSearch className="text-xl text-gray-500 ml-[-25px]"/>
                    </div>
                </div>
            </section>
            <section className="flex-auto bg-red-500">
                <MessageList query={query} setQuery={setQuery} queryFunc={useGetMessageFromChannelQuery}/>
            </section>
            <section className="h-[50px]">
                <MessageInput queryFunc={useSendMessageToChannelMutation}/>
            </section>
        </div>
    </>);
};