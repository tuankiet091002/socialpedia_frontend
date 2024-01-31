import {ChannelList} from "@features/channel/components/ChannelList.tsx";
import {Head} from "@components/elements/Head.tsx";
import {IoPeopleCircleOutline} from "react-icons/io5";

export const ChannelListPage = () => {

    return (<>
        <Head title="Channel List"/>
        <div className="min-h-full border border-gray-300 bg-gray-100 space-y-2">
            <section
                className="flex items-center gap-x-2 border-b border-gray-300 bg-gray-50 px-3 text-start text-3xl h-[50px]">
                <IoPeopleCircleOutline className="mr-2 inline rounded-md bg-blue-500 text-white"/>
                <span className="align-sub">Channel List</span>
            </section>
            <section className="bg-gray-100 p-2">
                <ChannelList/>
            </section>

        </div>
    </>)
}