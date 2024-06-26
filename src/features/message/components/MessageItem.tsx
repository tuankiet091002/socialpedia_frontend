import moment from "moment";
import {MessageResponse} from "@features/message/types/MessageResponse.ts";
import {Avatar} from "@components/elements/Avatar.tsx";
import {IoMdSettings} from "react-icons/io";
import {useDisclosure} from "@src/hooks/useDisclosure.ts";
import {Button} from "@components/elements/Button.tsx";
import {
    useDeleteMessageMutation,
    useUpdateMessageContentMutation,
    useUpdateMessageStatusMutation
} from "@features/message/api.ts";
import {ConfirmationDialog} from "@components/dialog/ConfirmationDialog.tsx";
import {Link, useParams} from "react-router-dom";
import {IndependentInput} from "@components/elements/IndependentInput.tsx";
import {useState} from "react";
import {MessageStatusType} from "@src/types.ts";
import {FilePreview} from "@components/elements/FilePreview.tsx";
import clsx from "clsx";
import {ImReply} from "react-icons/im";
import {useAuth} from "@src/hooks/useAuth.ts";

type MessageProps = {
    data: MessageResponse
    type: "inbox" | "channel"
    permission: boolean
    setReply?: (m: MessageResponse) => void
};

export const MessageItem = ({data, type, setReply, permission}: MessageProps) => {

    const {locationId: locationNum} = useParams();
    const locationId = Number(locationNum);
    const {data: owner} = useAuth();

    // trigger for edit message
    const {isOpen, close, toggle} = useDisclosure();
    const [edit, setEdit] = useState(false);
    const [content, setContent] = useState<string>(data.content);


    // hook api
    const [updateContent, updateResult] = useUpdateMessageContentMutation();
    const [updateStatus, updateStatusResult] = useUpdateMessageStatusMutation();
    const [deleteMessage, deleteResult] = useDeleteMessageMutation();

    if (!locationId) return null;

    return (<>
        {data.status == MessageStatusType.ACTIVE || data.status == MessageStatusType.PINNED ?
            <li className={`flex w-full flex-row gap-x-2 rounded-md pl-2 pt-2`}>
                <section className="flex flex-none flex-row items-start gap-4">
                    <Avatar src={data.createdBy!.avatar?.url} size="sm"/>
                </section>
                <section
                    className={clsx("relative flex flex-auto flex-col items-start rounded-md border border-gray-300 p-2 shadow-md divide-y-2 divide-gray-300",
                        data.status == MessageStatusType.ACTIVE ? "bg-gray-100" : "bg-yellow-300")}>
                    {/* wrapper for hover setting's effect */}
                    <div className="w-full group divide-y divide-gray-300">
                        <div className="flex w-full items-center justify-between ps-2 pe-[50px]">
                            <Link
                                to={`/user/${data.createdBy!.id != owner!.id ? data.createdBy!.id : "profile"}`}
                                className="cursor-pointer font-semibold hover:text-blue-500">
                                {data.createdBy!.name}
                            </Link>
                            <time>{moment(data.modifiedDate).fromNow()}</time>
                        </div>

                        <div className="flex flex-row gap-x-2">
                            {data.resources?.map((res, idx) =>
                                <FilePreview key={idx} src={res}/>)}
                        </div>
                        <IndependentInput value={content} disabled={!edit}
                                          className="w-full"
                                          onChange={e => setContent(e.target.value)}/>

                        {/* setting block */}
                        {(permission || data.createdBy!.id == owner!.id) && <div
                            className={clsx("absolute right-4 hidden bg-gray-100 text-blue-600 hover:bg-blue-600 hover:text-gray-100 top-[10px] border rounded-md border-gray-300 group-hover:block",
                                isOpen && "!block")}>
                            <IoMdSettings className="cursor-pointer text-2xl"
                                          onClick={() => {
                                              toggle();
                                              setContent(data.content);
                                              setEdit(false);
                                          }}/>
                        </div>}
                        {type == "channel" && <div
                            className={clsx("absolute right-4 hidden bg-gray-100 text-blue-600 hover:bg-blue-600 hover:text-gray-100 top-[40px] border rounded-md border-gray-300 group-hover:block",
                                isOpen && "!block")}>
                            <ImReply className="cursor-pointer text-2xl"
                                     onClick={() => setReply && setReply(data)}/>
                        </div>}
                    </div>

                    {/* replies block */}
                    {type == "channel" && data.replies.length > 0 && <section className="w-full">
                        {data.replies.map(rep => <MessageItem key={rep.id} data={rep} type={type}
                                                              setReply={setReply} permission={permission}/>)}
                    </section>}

                </section>

                {isOpen && <div className="z-20 rounded-md bg-white border-1">

                    {/* content edit button, only edit your own message*/}
                    {data.createdBy!.id == owner!.id &&
                        (!edit ? <Button size="sm" variant="inverse" className="w-full"
                                         onClick={() => setEdit(true)}>Edit message</Button> :
                                <Button size="sm" variant="inverse" className="w-full"
                                        isLoading={updateResult.isLoading}
                                        onClick={() => updateContent({id: data.id, locationId, content}).unwrap()
                                            .then(() => {
                                                window.alert("Content updated successfully!")
                                                setEdit(false);
                                                close()
                                            })}>Save</Button>
                        )}
                    {permission && <>
                        <Button size="sm" variant="inverse" className="w-full"
                                isLoading={updateStatusResult.isLoading}
                                onClick={() => updateStatus({
                                    id: data.id,
                                    locationId,
                                    status: data.status == MessageStatusType.ACTIVE ? MessageStatusType.PINNED : MessageStatusType.ACTIVE
                                }).unwrap()
                                    .then(() => {
                                        window.alert("Message status updated successfully!")
                                        setEdit(false);
                                        close()
                                    })}> {data.status == MessageStatusType.ACTIVE ? "Mark message" : "Unmark message"}</Button>

                        {/* message delete button*/}
                        <ConfirmationDialog type="danger" title="Delete Message"
                                            body="Are you sure you want to delete this message?"
                                            isDone={deleteResult.isSuccess}
                                            triggerButton={<Button variant="inverse_danger" size="sm">
                                                Delete message
                                            </Button>}
                                            confirmButton={<Button variant="danger"
                                                                   isLoading={deleteResult.isLoading}
                                                                   onClick={() => deleteMessage({
                                                                       locationId: locationId,
                                                                       id: data.id
                                                                   }).unwrap()
                                                                       .then(() => {
                                                                           window.alert("Message deleted successfully!")
                                                                           close();
                                                                       })}>
                                                Delete
                                            </Button>}/>
                    </>}
                </div>}
            </li> : data.status == MessageStatusType.INACTIVE ?
                <li className="rounded-md border border-gray-300 bg-gray-500 p-2 text-start text-gray-100">
                    Deleted message
                </li> :
                <li className="rounded-md bg-blue-500 p-2 text-start text-gray-100">
                    {data.content}
                </li>
        }</>)
}
