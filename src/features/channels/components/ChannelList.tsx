import {ChannelItem} from "@features/channels/components/ChannelItem.tsx";
import {Page} from "@src/types.ts";
import {ChannelResponse} from "@features/channels/types";


type ChannelListProps = {
    data: Page<ChannelResponse> | undefined;
}

export const ChannelList = ({data}: ChannelListProps) => {

    return (<div className="container p-2" style={{backgroundColor: "blue"}}>
            <ul className="list-group">
                {data?.content.map(item => <ChannelItem key={item.id} channel={item}/>)}
            </ul>
        </div>

    )
}