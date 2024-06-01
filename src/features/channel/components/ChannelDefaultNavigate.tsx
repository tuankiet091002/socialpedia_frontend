import {useSelector} from "react-redux";
import {RootState} from "@src/main.tsx";
import {useGetPersonalChannelListQuery} from "@features/channel/api.ts";
import {Navigate} from "react-router-dom";

export const ChannelDefaultNavigate = () => {
    const query = useSelector((state: RootState) => state.query.channelQuery)
    // main data
    const {data} = useGetPersonalChannelListQuery(query);

    if (!data) return null;

    return (<div className="flex h-full w-full items-center justify-center">
        {data.content.length > 0 ? <Navigate to={data.content[0].id.toString()}/> :
            <p className="text-4xl text-gray-500">Join or create a channel</p>}
    </div>)
}