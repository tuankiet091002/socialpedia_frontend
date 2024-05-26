import {HiOutlineUserGroup} from "react-icons/hi";
import {SpaceList} from "@features/message/components/SpaceList.tsx";

export const InboxColumn = () => {

    return (<div className="flex h-full flex-col border border-gray-300 bg-gray-200 shadow-md">
        <section
            className="flex items-center border border-gray-300 px-3 text-start text-3xl h-[50px]">
            <HiOutlineUserGroup className="mr-2 inline rounded-md bg-blue-500 text-white"/>
            <span className="align-sub">Inbox Chat</span>
        </section>
        <section className="grow">
            <SpaceList type="inbox"/>
        </section>
    </div>)
}