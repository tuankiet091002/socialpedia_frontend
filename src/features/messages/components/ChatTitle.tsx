import {useParams} from "react-router-dom";
import {useGetOneChannelQuery} from "@features/channels/api.ts";

export const ChatTitle = () => {
    const {channelId} = useParams();

    const {data} = useGetOneChannelQuery(+(channelId as string));

    if (!data) return null;

    return (<div>
        {data.name}
    </div>)
}