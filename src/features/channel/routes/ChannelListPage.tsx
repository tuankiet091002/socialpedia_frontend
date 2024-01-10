import {ChannelList} from "@features/channel/components/ChannelList.tsx";
import {Head} from "@components/elements/Head.tsx";
import {IoFilter, IoPeopleCircleOutline} from "react-icons/io5";
import {IoIosSearch} from "react-icons/io";

export const ChannelListPage = () => {

    return (<>
        <Head title="Channel List"/>
        <div className="h-full bg-red-200">
            <div
                className="flex items-center border border-gray-300 bg-white px-3 text-start text-3xl shadow-2xl h-[50px]">
                <IoPeopleCircleOutline className="mr-2 inline rounded-md bg-blue-500 text-white"/>
                <span className="align-sub">Channel List</span>
            </div>
            <div className="flex items-center border border-gray-300 px-3 text-start shadow-2xl h-[50px]">
                <IoFilter className="mr-3 inline"/>
                <span className="mr-3">Filter:</span>
                <div className="flex flex-row items-center">
                    <input type="text" className="inline appearance-none text-sm rounded-sm border border-gray-300 pl-2 
                    pr-[25px] py-1 shadow-sm placeholder-gray-400  focus:outline-none" placeholder="Find"/>
                    <IoIosSearch className="text-gray-500 ml-[-25px]"/>
                </div>
            </div>
            <div className="p-3">
                <ChannelList/>
            </div>
        </div>
    </>)
}