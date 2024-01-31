import moment from "moment";
import {MessageResponse} from "@features/message/types/MessageResponse.ts";
import {Avatar} from "@components/elements/Avatar.tsx";
import {IoMdSettings} from "react-icons/io";
import {useDisclosure} from "@src/hooks/useDisclosure.ts";
import clsx from "clsx";
import {Button} from "@components/elements/Button.tsx";
import {useDeleteMessageMutation, useUpdateMessageContentMutation} from "@features/message/api.ts";
import {ConfirmationDialog} from "@components/dialog/ConfirmationDialog.tsx";
import {useParams} from "react-router-dom";
import {IndependentInput} from "@components/elements/IndependentInput.tsx";
import {useState} from "react";
import {MessageStatusType} from "@src/types.ts";

type MessageProps = {
    data: MessageResponse
};

export const MessageItem = ({data}: MessageProps) => {

    const {locationId: locationNum} = useParams();
    const locationId = Number(locationNum);

    // trigger for edit message
    const {isOpen, close, toggle} = useDisclosure();
    const [edit, setEdit] = useState(false);
    const [content, setContent] = useState<string>(data.content);

    // hook api
    const [updateContent, updateResult] = useUpdateMessageContentMutation();
    const [deleteMessage, deleteResult] = useDeleteMessageMutation();

    return (<>
        {data.status == MessageStatusType.ACTIVE ?
            <li className="flex w-full flex-row gap-x-2 rounded-md p-2 group">
                <section className="flex flex-none flex-row items-start gap-4">
                    <Avatar src={data.createdBy!.avatar?.url} size="sm"/>
                </section>
                <section
                    className="relative flex flex-auto flex-col items-start rounded-md border border-gray-300 bg-gray-100 p-2 shadow-md divide-y divide-gray-300">
                    <div className="flex w-full items-center justify-between px-2">
                        <p className="font-semibold">{data.createdBy!.name}</p>
                        <time>{moment(data.modifiedDate).fromNow()}</time>
                    </div>

                    <div className="flex flex-row gap-x-2">
                        {data.resources?.map((res, idx) =>
                            <Avatar key={idx} src={res.url} size="md" className="!rounded-none !w-auto"/>)}
                    </div>
                    <IndependentInput value={content} disabled={!edit}
                                      className="w-full"
                                      onChange={e => setContent(e.target.value)}/>

                    {/* setting block */}
                    <div
                        className={clsx("absolute right-2 hidden bg-gray-100 text-blue-600 hover:bg-blue-600 hover:text-gray-100 top-[-14px] group-hover:block border rounded-md border-gray-300",
                            isOpen && "!block")}>
                        <IoMdSettings className="cursor-pointer text-2xl"
                                      onClick={() => {
                                          toggle();
                                          setContent(data.content);
                                          setEdit(false);
                                      }}/>
                    </div>
                </section>

                {isOpen && <div className="z-20 rounded-md bg-white border-1">

                    {/* content edit button*/}
                    {!edit ? <Button size="sm" variant="inverse" className="w-full"
                                     onClick={() => setEdit(true)}>Edit Message</Button> :
                        <Button size="sm" variant="inverse" className="w-full"
                                isLoading={updateResult.isLoading}
                                onClick={() => updateContent({id: data.id, locationId, content}).unwrap()
                                    .then(() => {
                                        window.alert("Content updated successfully!")
                                        setEdit(false);
                                        close()
                                    })}>Save</Button>
                    }
                    <Button size="sm" variant="inverse" className="w-full"
                            isLoading={updateResult.isLoading}
                            onClick={() => updateContent({id: data.id, locationId, content}).unwrap()
                                .then(() => {
                                    window.alert("Content updated successfully!")
                                    setEdit(false);
                                    close()
                                })}>Edit Status</Button>
                    {/* message delete button*/}
                    <ConfirmationDialog type="danger" title="Delete Message"
                                        body="Are you sure you want to delete this message?"
                                        isDone={deleteResult.isSuccess}
                                        triggerButton={<Button variant="inverse_danger" size="sm">
                                            Delete Message
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
                </div>}
            </li> : data.status == MessageStatusType.INACTIVE ?
                <li className="rounded-md border border-gray-300 bg-gray-500 p-2 text-start text-gray-100">
                    Deleted message
                </li> :
                <li className="rounded-md p-2 text-start text-gray-100 bg-blue-500">
                    {data.content}
                </li>
        }</>)
}
