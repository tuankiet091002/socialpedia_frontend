import {Page} from "@src/types.ts";
import {ChannelResponse} from "@features/channel/types/ChannelResponse.ts";
import {InboxItem} from "@features/inbox/components/InboxItem.tsx";

type InboxListProps = {
    data: Page<ChannelResponse>
}

export const InboxList = ({data}: InboxListProps) => {

    return (<div className="container p-2" style={{backgroundColor: "blue"}}>
            <ul className="list-group">
                {data?.content.map(item => <InboxItem key={item.id} inbox={item}/>)}
            </ul>
        </div>

    )
}