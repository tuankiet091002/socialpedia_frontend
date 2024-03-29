import {HiOutlineUserGroup} from "react-icons/hi";
import {ChannelCreateForm} from "@features/channel/components/ChannelColumn/ChannelCreateForm";
import {useState} from "react";
import {Button} from "@components/elements/Button.tsx";
import {SpaceList} from "@features/message/components/SpaceList.tsx";

export const ChannelColumn = () => {
    const [show, setShow] = useState<boolean>(false);

    return (<div className="flex h-full flex-col border border-gray-300 bg-gray-200 shadow-md">
        <section
            className="flex items-center border border-gray-300 px-3 text-start text-3xl h-[50px]">
            <HiOutlineUserGroup className="mr-2 inline rounded-md bg-blue-500 text-white"/>
            <span className="align-sub">Channel Chat</span>
        </section>
        <section className="grow">
            <SpaceList type="channel"/>
        </section>
        <section className="flex justify-center p-1 h-[50px]">
            <Button type="button" onClick={() => setShow(true)}>Create New Channel</Button>
            {show && <ChannelCreateForm setShow={setShow}/>}
        </section>
    </div>);
};