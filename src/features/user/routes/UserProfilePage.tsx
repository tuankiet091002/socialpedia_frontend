import {useParams} from "react-router-dom";
import {UserProfileForm} from "@features/user/components/UserProfilePage/UserProfileForm.tsx";
import {useGetUserProfileQuery} from "@features/user/api.ts";
import {UserAvatarForm} from "@features/user/components/UserProfilePage/UserAvatarForm.tsx";
import {IoPeopleCircleOutline} from "react-icons/io5";
import {Button} from "@components/elements/Button.tsx";
import {Head} from "@components/elements/Head.tsx";
import emptyAvatar from "@assets/empty avatar.jpg";
import {
    useAcceptFriendRequestMutation,
    useCreateFriendRequestMutation,
    useGetUserFriendshipQuery,
    useRejectFriendRequestMutation,
    useUnFriendMutation
} from "@features/auth/api.ts";
import {RequestType} from "@src/types.ts";
import {useAuth} from "@utils/useAuth.ts";

export const UserProfilePage = () => {
    // get user email
    const {userId: userIdString} = useParams();
    const userId = Number(userIdString);

    // main data
    const {data} = useGetUserProfileQuery(Number(userId));
    const {user} = useAuth();
    const {data: friendship} = useGetUserFriendshipQuery(userId);
    const [createRequest, createResult] = useCreateFriendRequestMutation();
    const [acceptRequest, acceptResult] = useAcceptFriendRequestMutation();
    const [rejectRequest, rejectResult] = useRejectFriendRequestMutation();
    const [unFriend, unFriendResult] = useUnFriendMutation();

    if (!data || !user) return null;

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
                <UserAvatarForm defaultUrl={data.avatar?.url || emptyAvatar}/>
                <div className="text-5xl text-white">{data.name}</div>

            </div>
            <div className="flex items-center justify-end gap-4 bg-white px-5 shadow-2xl h-[50px]">
                {
                    // waiting for response
                    friendship?.status == RequestType.PENDING && friendship?.senderId == user.id ?
                        <>
                            <Button type="button" variant="inverse" disabled={true}
                                    className="w-[250px]">Đang chờ phản hồi</Button>
                        </> : friendship?.status == RequestType.PENDING && friendship?.receiverId == user.id ?
                            <>
                                <Button type="button" className="w-[170px]"
                                        onClick={() => acceptRequest(userId)} isLoading={acceptResult.isLoading}>
                                    Chấp nhận
                                </Button>
                                <Button type="button" variant="danger" className="w-[170px]"
                                        onClick={() => rejectRequest(userId)} isLoading={rejectResult.isLoading}>
                                    Từ chối
                                </Button>
                            </>
                            // already friend
                            : friendship?.status == RequestType.ACCEPTED ?
                                <>
                                    <Button type="button" className="w-[170px]">Nhắn tin</Button>
                                    <Button type="button" variant="danger" className="w-[170px]"
                                            onClick={() => unFriend(userId)} isLoading={unFriendResult.isLoading}>
                                        Hủy kết bạn
                                    </Button>
                                </> :
                                // don't have any relationship
                                <>
                                    <Button type="button" className="w-[170px]"
                                            onClick={() => createRequest(userId)} isLoading={createResult.isLoading}>
                                        Thêm bạn
                                    </Button>
                                </>
                }
            </div>
            <div className="p-10">
                <UserProfileForm data={data} edit={false}/>
            </div>
        </div>
    </>);
};