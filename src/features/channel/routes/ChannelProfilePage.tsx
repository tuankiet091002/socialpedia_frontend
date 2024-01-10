import {useParams} from "react-router-dom";
import {useGetChannelProfileQuery} from "@features/channel/api.ts";
import {Head} from "@components/elements/Head.tsx";
import {IoListOutline} from "react-icons/io5";
import {Button} from "@components/elements/Button.tsx";
import {ChannelAvatarForm} from "@features/channel/components/ChannelProfilePage/ChannelAvatarForm.tsx";
import {ChannelMemberForm} from "@features/channel/components/ChannelProfilePage/ChannelMemberForm.tsx";
import {ChannelProfileForm} from "@features/channel/components/ChannelProfilePage/ChannelProfileForm.tsx";

export const ChannelProfilePage = () => {
    //// SETTING VARIABLES
    // get user email
    const {locationId} = useParams();

    // main data
    const {data} = useGetChannelProfileQuery(Number(locationId));
    if (!data) return null;

    return (<>
            <Head title={`${data.name} | Profile`}/>
            <div className="min-h-full w-full bg-white">
                <div
                    className="flex items-center border border-gray-300 bg-white px-3 text-start text-3xl shadow-2xl h-[50px]">
                    <IoListOutline className="mr-2 inline rounded-md bg-blue-500 text-white"/>
                    <span className="align-sub">Channel Profile</span>
                </div>
                <div
                    className={`relative flex items-center justify-between px-6 py-3 h-[120px] lg:justify-center
                bg-[url("/src/assets/8795038.jpg")]`}>
                    <ChannelAvatarForm data={data} edit={false}/>
                </div>
                <div className="flex items-center justify-end gap-4 bg-white px-5 shadow-2xl h-[50px]">
                    <Button type="button" className="w-[170px]">Tham gia</Button>
                </div>
                <div className="grid p-10 grid-cols-[2fr_3fr] space-x-4">
                    <ChannelProfileForm data={data} edit={false}/>
                    <ChannelMemberForm data={data} edit={false}/>
                </div>
            </div>
        </>
    );
}