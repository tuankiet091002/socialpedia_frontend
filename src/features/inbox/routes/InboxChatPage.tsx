import {MessageList} from "@features/message/components/MessageList.tsx";
import {useSendMessageToInboxMutation} from "@features/message/api.ts";
import {Head} from "@components/elements/Head.tsx";
import emptyAvatar from "@assets/empty avatar.jpg";
import {IoFilter} from "react-icons/io5";
import {IoIosSearch} from "react-icons/io";
import {useParams} from "react-router-dom";
import {useGetInboxProfileQuery} from "@features/inbox/api.ts";
import {MessageInput} from "@features/message/components/MessageInput.tsx";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@src/main.tsx";
import {messageQueryChange} from "@utils/querySlice.ts";
import {InboxNameForm} from "@features/inbox/components/InboxNameForm.tsx";

export const InboxChatPage = () => {
    //// SETTING VARIABLES
    // get current locationId as number
    const {locationId: locationNum} = useParams();
    const locationId = Number(locationNum);
    // get query, or else insert new query
    const dispatch = useDispatch();
    const query = useSelector((state: RootState) => state.query.messageQuery.find(m => m.locationId == locationId));
    if (!query) dispatch(messageQueryChange({locationId, content: "", pageNo: 0, pageSize: 7}))
    const [content, setContent] = useState<string>("");

    // main data
    const {data} = useGetInboxProfileQuery(locationId);

    // only fetch using query after 500ms delay
    useEffect(() => {
        const timer = setTimeout(() => {
            // merge name into query
            dispatch(messageQueryChange({...query!, content}))
        }, 500);

        return () => clearTimeout(timer);
    }, [content]);

    if (!data) return null;

    return (<>
        <Head title={`${data.name}`}/>
        <div className="flex h-full flex-col">
            <section
                className="flex items-center justify-between border border-gray-300 bg-white px-3 shadow-2xl h-[60px]">
                <div className="flex flex-row gap-x-4">
                    <img className="h-10 w-10 rounded-full" src={data.avatar?.url || emptyAvatar} alt=""/>
                    <InboxNameForm data={data}/>
                </div>

                <div className="flex items-center text-start shadow-2xl">
                    <IoFilter className="mr-3 inline"/>
                    <span className="mr-3">Filter:</span>
                    <div className="flex flex-row items-center">
                        <input type="text" className="w-full inline appearance-none text-sm pl-2
                    pr-[25px] py-1 shadow-sm rounded-md border border-gray-300 focus:outline-none placeholder-gray-400"
                               placeholder="Find"
                               onChange={e => setContent(e.target.value)}/>
                        <IoIosSearch className="text-xl text-gray-500 ml-[-25px]"/>
                    </div>
                </div>
            </section>
            <section className="flex-auto bg-red-500">
                <MessageList type="inbox" query={query!}/>
            </section>
            <section className="h-[50px]">
                <MessageInput queryFunc={useSendMessageToInboxMutation}/>
            </section>
        </div>
    </>);
};