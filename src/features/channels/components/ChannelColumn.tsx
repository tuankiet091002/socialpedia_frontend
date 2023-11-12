import {ChannelTitle} from "@features/channels/components/ChannelTitle.tsx";
import {ChannelList} from "@features/channels/components/ChannelList.tsx";
import {ChannelAdd} from "@features/channels/components/ChannelAdd.tsx";

export const ChannelColumn = () => {
    return (<div className="h-100 d-flex flex-column ">
        <ChannelTitle/>
        <ChannelList/>
        <ChannelAdd/>
    </div>)
}