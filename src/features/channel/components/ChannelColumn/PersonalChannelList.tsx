import {ChannelResponse} from "@features/channel/types/ChannelResponse.ts";
import {Page} from "@src/types.ts";
import {ChannelItem} from "@features/channel/components/ChannelItem.tsx";

type PersonalChannelListProps = {
    data: Page<ChannelResponse>
}

export const PersonalChannelList = ({data}: PersonalChannelListProps) => {

    return (<div className="container p-2" style={{backgroundColor: "blue"}}>
            <ul className="list-group">
                {data?.content.map(item => <ChannelItem key={item.id} channel={item}/>)}
            </ul>
        </div>

    )
}