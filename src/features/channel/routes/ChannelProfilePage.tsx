import {useParams} from "react-router-dom";
import {useGetChannelProfileQuery} from "@features/channel/api.ts";
import {ChannelAvatarForm} from "@features/channel/components/ChannelProfilePage/ChannelAvatarForm.tsx";
import {ChannelProfileForm} from "@features/channel/components/ChannelProfilePage/ChannelProfileForm.tsx";
import {ChannelMemberForm} from "@features/channel/components/ChannelProfilePage/ChannelMemberForm.tsx";

export const ChannelProfilePage = () => {
    //// SETTING VARIABLES
    // get user email
    const {channelId} = useParams();

    // main data
    const {data} = useGetChannelProfileQuery(Number(channelId));
    if (!data) return null;

    return (
        <div className="container">
            <ChannelAvatarForm data={data}/>
            <ChannelProfileForm data={data}/>
            <ChannelMemberForm data={data}/>
        </div>
    );
}