import {useParams} from "react-router-dom";
import {useGetChannelProfileQuery} from "@features/channel/api.ts";
import {Head} from "@components/elements/Head.tsx";
import {IoListOutline} from "react-icons/io5";
import {Button} from "@components/elements/Button.tsx";
import {ChannelAvatarForm} from "@features/channel/components/ChannelProfilePage/ChannelAvatarForm.tsx";
import {ChannelMemberForm} from "@features/channel/components/ChannelProfilePage/ChannelMemberForm.tsx";
import {ChannelProfileForm} from "@features/channel/components/ChannelProfilePage/ChannelProfileForm.tsx";
import {RequestType} from "@src/types.ts";
import {
    useCreateChannelRequestMutation,
    useGetChannelRelationQuery,
    useLeaveChannelMutation
} from "@features/auth/api.ts";
import {useState} from "react";
import {ConfirmationDialog} from "@components/dialog/ConfirmationDialog.tsx";

export const ChannelProfilePage = () => {
    //// SETTING VARIABLES
    // get user email
    const {locationId: locationIdString} = useParams();
    const locationId = Number(locationIdString);

    // main data
    const {data} = useGetChannelProfileQuery(locationId);
    const {data: member} = useGetChannelRelationQuery(locationId);
    const [edit, setEdit] = useState<boolean>(false);
    const [createRequest, createResult] = useCreateChannelRequestMutation();
    const [leaveRequest, leaveResult] = useLeaveChannelMutation();

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
                    <ChannelAvatarForm data={data} edit={edit}/>
                </div>
                <div className="flex items-center justify-end gap-4 bg-white px-5 shadow-2xl h-[50px]">
                    {
                        // waiting for response
                        member?.status == RequestType.PENDING ?
                            <>
                                <Button type="button" variant="inverse" disabled={true}
                                        className="w-[250px]">Waiting for response</Button>
                            </>
                            // already member
                            : member?.status == RequestType.ACCEPTED ?
                                <>
                                    <Button type="button" onClick={() => setEdit(e => !e)}>Edit</Button>
                                    <ConfirmationDialog
                                        title="Leave channel"
                                        type="danger"
                                        body="Are you sure you want to leave this channel?"
                                        isDone={leaveResult.isSuccess}
                                        triggerButton={<Button type="button" variant="danger">Leave Channel</Button>}
                                        confirmButton={
                                            <Button type="button" variant="danger"
                                                    onClick={() => leaveRequest(locationId)}
                                                    isLoading={leaveResult.isLoading}>
                                                Leave Channel
                                            </Button>}
                                    />

                                </> :
                                // don't have any relationship
                                <>
                                    <Button type="button" className="w-[170px]"
                                            onClick={() => createRequest(locationId)} isLoading={createResult.isLoading}>
                                        Join Channel
                                    </Button>
                                </>
                    }
                </div>
                <div className="grid p-10 grid-cols-[2fr_3fr] space-x-4">
                    <ChannelProfileForm data={data} edit={edit} setEdit={setEdit}/>
                    <ChannelMemberForm data={data} edit={edit} setEdit={setEdit}/>
                </div>
            </div>
        </>
    );
};