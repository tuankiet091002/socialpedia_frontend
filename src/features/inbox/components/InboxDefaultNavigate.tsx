import {useSelector} from "react-redux";
import {RootState} from "@src/main.tsx";
import {Navigate} from "react-router-dom";
import {useGetInboxListQuery} from "@features/inbox/api.ts";

export const InboxDefaultNavigate = () => {
    const query = useSelector((state: RootState) => state.query.channelQuery)
    // main data
    const {data} = useGetInboxListQuery(query);

    if (!data) return null;

    return (<div className="flex h-full w-full items-center justify-center">
        {data.content.length > 0 ? <Navigate to={data.content[0].id.toString()}/> :
            <p className="text-4xl text-gray-500">Create an inbox from your friend's profile page</p>}
    </div>)
}