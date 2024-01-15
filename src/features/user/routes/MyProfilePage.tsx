import {UserAvatarForm} from "@features/user/components/UserProfilePage/UserAvatarForm.tsx";
import {UserProfileForm} from "@features/user/components/UserProfilePage/UserProfileForm.tsx";
import {IoPeopleCircleOutline} from "react-icons/io5";
import {Button} from "@components/elements/Button.tsx";
import {useState} from "react";
import {useAuth} from "@utils/useAuth.ts";

export const MyProfilePage = () => {

    const [edit, setEdit] = useState<boolean>(false);

    // main data
    const {user} = useAuth();
    if (!user) return null;

    return (
        <div className="min-h-full w-full bg-white">
            <div
                className="flex items-center border border-gray-300 bg-white px-3 text-start text-3xl shadow-2xl h-[50px]">
                <IoPeopleCircleOutline className="mr-2 inline rounded-md bg-blue-500 text-white"/>
                <span className="align-sub">Personal Profile</span>
            </div>
            <div
                className={`relative flex items-center justify-between px-6 py-3 h-[120px] lg:justify-center
                bg-[url("/src/assets/8795038.jpg")]`}>
                <UserAvatarForm edit={edit} defaultUrl={user.avatar?.url}/>
                <div className="text-5xl text-white">{user.name}</div>

            </div>
            <div className="flex items-center justify-end gap-4 bg-white px-5 shadow-2xl h-[50px]">
                <Button type="button" className="w-[170px]"
                        onClick={() => setEdit(true)} disabled={edit}>Edit Profile</Button>
                <Button type="button" className="">Change Password</Button>
            </div>
            <div className="p-10">
                <UserProfileForm data={user} edit={edit} setEdit={setEdit}/>
            </div>

        </div>
    );
};