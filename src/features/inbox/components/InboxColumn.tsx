import {InboxList} from "@features/inbox/components/InboxList.tsx";
import {HiOutlineUserGroup} from "react-icons/hi";

export const InboxColumn = () => {

    return (<div className="flex h-full flex-col">
        <section
            className="flex items-center border border-gray-300 bg-white px-3 text-start text-3xl shadow-2xl h-[50px]">
            <HiOutlineUserGroup className="mr-2 inline rounded-md bg-blue-500 text-white"/>
            <span className="align-sub">Inbox Chat</span>
        </section>
        <section className="grow bg-yellow-300">
            <InboxList/>
        </section>
    </div>)
}