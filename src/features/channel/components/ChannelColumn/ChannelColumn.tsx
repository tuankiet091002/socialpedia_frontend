import {PersonalChannelList} from "@features/channel/components/ChannelColumn/PersonalChannelList.tsx";
import {HiOutlineUserGroup} from "react-icons/hi";
import {ChannelCreateForm} from "@features/channel/components/ChannelColumn/ChannelCreateForm.tsx";
import {useState} from "react";
import {Button} from "@components/elements/Button.tsx";

export const ChannelColumn = () => {
    const [show, setShow] = useState<boolean>(false);

    return (<div className="flex h-full flex-col">
        <section
            className="flex items-center border border-gray-300 bg-white px-3 text-start text-3xl shadow-2xl h-[50px]">
            <HiOutlineUserGroup className="mr-2 inline rounded-md bg-blue-500 text-white"/>
            <span className="align-sub">Channel Chat</span>
        </section>
        <section className="grow bg-yellow-300">
            <PersonalChannelList/>
        </section>
        <section className="h-[50px] flex justify-center p-1">
            <Button type="button" onClick={() => setShow(true)}>Create New Channel</Button>
            {show && <ChannelCreateForm setShow={setShow}/>}
        </section>
    </div>);
};