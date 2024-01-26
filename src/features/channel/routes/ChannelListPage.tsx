import {ChannelList} from "@features/channel/components/ChannelList.tsx";
import {Head} from "@components/elements/Head.tsx";
import {IoPeopleCircleOutline} from "react-icons/io5";

export const ChannelListPage = () => {

    return (<>
        <Head title="Channel List"/>
        <div className="min-h-full bg-red-200">
            <div
                className="flex items-center border border-gray-300 bg-white px-3 text-start text-3xl shadow-2xl h-[50px]">
                <IoPeopleCircleOutline className="mr-2 inline rounded-md bg-blue-500 text-white"/>
                <span className="align-sub">Channel List</span>
            </div>

            <ChannelList/>
        </div>
    </>)
}