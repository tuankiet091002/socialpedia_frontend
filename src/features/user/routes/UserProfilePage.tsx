import {useNavigate, useParams} from "react-router-dom";
import {UserProfileForm} from "@features/user/components/UserProfilePage/UserProfileForm.tsx";
import {useGetUserProfileQuery} from "@features/user/api.ts";
import {UserAvatarForm} from "@features/user/components/UserProfilePage/UserAvatarForm.tsx";
import {IoPeopleCircleOutline} from "react-icons/io5";
import {Button} from "@components/elements/Button.tsx";
import {Head} from "@components/elements/Head.tsx";
import {
    useAcceptFriendRequestMutation,
    useCreateFriendRequestMutation,
    useGetUserFriendshipQuery,
    useRejectFriendRequestMutation,
    useUnFriendMutation
} from "@features/auth/api.ts";
import {RequestType} from "@src/types.ts";
import {useCreateInboxMutation} from "@features/inbox/api.ts";
import {ConfirmationDialog} from "@components/dialog/ConfirmationDialog.tsx";
import {useAuth} from "@src/hooks/useAuth.ts";

export const UserProfilePage = () => {
    ////
    // get user email
    const navigate = useNavigate()
    const {userId: userIdString} = useParams();
    const userId = Number(userIdString);

    // main data
    const {data} = useGetUserProfileQuery(Number(userId));
    const {data: user} = useAuth();
    const {data: friendship} = useGetUserFriendshipQuery(userId);
    const [createInbox] = useCreateInboxMutation();
    const [createRequest, createResult] = useCreateFriendRequestMutation();
    const [acceptRequest, acceptResult] = useAcceptFriendRequestMutation();
    const [rejectRequest, rejectResult] = useRejectFriendRequestMutation();
    const [unFriend, unFriendResult] = useUnFriendMutation();

    if (!data || !user) return null;

    const handleNavigateToMessage = () => {
        if (friendship?.inboxId) {
            navigate(`/inbox/${friendship.inboxId}`)
        } else {
            createInbox(userId).unwrap()
                .then(() => navigate(`/inbox`))
        }
    }

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
                <UserAvatarForm edit={false} defaultUrl={data.avatar?.url}/>
                <div className="text-5xl text-white">{data.name}</div>

            </div>
            <div className="flex items-center justify-end gap-4 bg-white px-5 shadow-2xl h-[50px]">
                {
                    // waiting for response
                    friendship?.status == RequestType.PENDING && friendship?.other.id != user.id ?
                        <>
                            <Button type="button" variant="inverse" disabled={true}
                                    className="w-[250px]">Wait for response</Button>
                        </> : friendship?.status == RequestType.PENDING && friendship?.other.id == user.id ?
                            <>
                                <Button type="button" className="w-[170px]"
                                        onClick={() => acceptRequest(userId).unwrap()
                                            .then(() => window.alert("Request accepted!"))}
                                        isLoading={acceptResult.isLoading}>
                                    Accept
                                </Button>
                                <Button type="button" variant="danger" className="w-[170px]"
                                        onClick={() => rejectRequest(userId).unwrap()
                                            .then(() => window.alert("Request rejected!"))}
                                        isLoading={rejectResult.isLoading}>
                                    Reject
                                </Button>
                            </>
                            // already friend
                            : friendship?.status == RequestType.ACCEPTED ?
                                <>
                                    <Button type="button" onClick={handleNavigateToMessage}>Message</Button>
                                    <ConfirmationDialog
                                        isDone={unFriendResult.isSuccess}
                                        type="danger"
                                        title="Unfriend user"
                                        body={"Are you sure you want to unfriend this user? Your inboxes will also be unusable."
                                        }
                                        triggerButton={<Button type="button" variant="danger" className="w-[170px]">
                                            Unfriend
                                        </Button>}
                                        confirmButton={
                                            <Button type="button" variant="danger" className="w-[170px]"
                                                    onClick={() => unFriend(userId).unwrap()
                                                        .then(() => window.alert("Unfriend successfully!"))}
                                                    isLoading={unFriendResult.isLoading}>
                                                Unfriend
                                            </Button>
                                        }
                                    />

                                </> :
                                // don't have any relationship
                                <>
                                    <Button type="button" className="w-[170px]"
                                            onClick={() => createRequest(userId).unwrap()
                                                .then(() => window.alert("Friend request sent!"))}
                                            isLoading={createResult.isLoading}>
                                        Add friend
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