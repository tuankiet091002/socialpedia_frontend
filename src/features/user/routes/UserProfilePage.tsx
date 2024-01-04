import {Link, useParams} from "react-router-dom";
import {Button} from "@components/elements/Button.tsx";
import {UserProfileForm} from "@features/user/components/UserProfilePage/UserProfileForm.tsx";
import {useGetUserProfileQuery} from "@features/user/api.ts";
import {UserAvatarForm} from "@features/user/components/UserProfilePage/UserAvatarForm.tsx";

export const UserProfilePage = () => {
    //// SETTING VARIABLES
    // get user email
    const {userEmail} = useParams();

    // main data
    const {data} = useGetUserProfileQuery(decodeURIComponent(userEmail as string));
    if (!data) return null;


    return (
        <div className="container">
            <UserAvatarForm defaultUrl={data.avatar.url}/>
            <UserProfileForm data={data}/>
            <Link to="/users/changePassword">
                <Button type="button" className="w-full mx-2">Change password</Button>
            </Link>
        </div>
    )
}