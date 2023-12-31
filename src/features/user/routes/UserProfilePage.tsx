import {useParams} from "react-router-dom";
import {UserProfileForm} from "@features/user/components/UserProfilePage/UserProfileForm.tsx";
import {useGetUserProfileQuery} from "@features/user/api.ts";
import {UserAvatarForm} from "@features/user/components/UserProfilePage/UserAvatarForm.tsx";
import {IoPeopleCircleOutline} from "react-icons/io5";
import {Button} from "@components/elements/Button.tsx";
import {Head} from "@components/elements/Head.tsx";

export const UserProfilePage = () => {

    //// SETTING VARIABLES
    // get user email
    const {userEmail} = useParams();

    // main data
    const {data} = useGetUserProfileQuery(decodeURIComponent(userEmail as string));
    if (!data) return null;

    return (<>
        <Head title={`${data.name} | Profile`}/>
        <div className="min-h-full w-full bg-white">
            <div
                className="flex items-center border border-gray-300 bg-white px-3 text-start text-3xl shadow-2xl h-[50px]">
                <IoPeopleCircleOutline className="mr-2 inline rounded-md bg-blue-500 text-white"/>
                <span className="align-sub">User Profile</span>
            </div>
            <div
                className={`relative flex items-center justify-between px-6 py-3 h-[120px] lg:justify-center
                bg-[url("/src/assets/8795038.jpg")]`}>
                <UserAvatarForm defaultUrl={data.avatar.url}/>
                <div className="text-5xl text-white">{data.name}</div>

            </div>
            <div className="flex items-center justify-end gap-4 bg-white px-5 shadow-2xl h-[50px]">
                <Button type="button" className="w-[170px]">Nhắn tin</Button>
                <Button type="button" className="w-[170px]">Thêm bạn</Button>
            </div>
            <div className="p-10">
                <UserProfileForm data={data} edit={false}/>
            </div>
        </div>
    </>)
}