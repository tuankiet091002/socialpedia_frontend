import {FormEvent, useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";
import {BaseQueryFn, FetchArgs, FetchBaseQueryError, MutationDefinition} from "@reduxjs/toolkit/query";
import {UseMutation} from "@reduxjs/toolkit/dist/query/react/buildHooks";
import {MessageCreateRequest} from "@features/message/types/MessageCreateRequest.ts";
import {MdAttachFile} from "react-icons/md";
import {Button} from "@components/elements/Button.tsx";
import {FaPaperPlane} from "react-icons/fa";
import {RxCross1} from "react-icons/rx";
import {sendTo} from "@utils/socketMessage.ts";
import {SocketType} from "@src/types.ts";
import {FilePreview} from "@components/elements/FilePreview.tsx";
import {useAuth} from "@src/hooks/useAuth.ts";
import {MessageResponse} from "@features/message/types/MessageResponse.ts";
import clsx from "clsx";

type MessageInputProps = {
    queryFunc: UseMutation<MutationDefinition<
        MessageCreateRequest,
        BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
        "Message",
        void,
        "message">>;
    reply?: MessageResponse | null
    setReply?: (m: MessageResponse) => void
    writePermission: boolean
}

export const MessageInput = ({queryFunc, reply, setReply, writePermission}: MessageInputProps) => {
    const {locationId} = useParams();
    const [createMessage] = queryFunc();
    const [files, setFiles] = useState<File[]>([]);
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const {data: owner} = useAuth();
    // timeout func for typing socket message
    let keyTimer: ReturnType<typeof setTimeout> | null = null;

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const target = e.target as typeof e.target & {
            content: { value: string };
        };
        const content = target.content.value;

        createMessage({locationId: Number(locationId), content: content, replyTo: reply?.id, files: files});

        (e.target as typeof e.target & { content: { value: string } }).content.value = "";

        // switch back to no reply
        if (setReply) {
            setReply(reply!);
        }

        setFiles([]);
    };

    // don't send anything if value is the same
    const prevIsTyping = useRef(false);
    useEffect(() => {
        if (isTyping != prevIsTyping.current) {
            // socket message
            prevIsTyping.current = isTyping;
            sendTo(`space/${locationId}`, isTyping ? SocketType.TYPE : SocketType.STOP_TYPE, {
                id: owner!.id,
                name: owner!.name
            }).then();
        }
    }, [owner, isTyping, locationId]);

    return (
        <div className="relative flex h-full items-center gap-x-2 px-6">
            <label htmlFor="messageFileInput"
                   className="flex cursor-pointer items-center rounded-md bg-gray-200 p-1 shadow-sm hover:bg-gray-400">
                <MdAttachFile className="text-3xl"/>
            </label>
            <input
                id="messageFileInput"
                type="file"
                className="hidden"
                multiple={true}
                disabled={!writePermission}
                onChange={(e) => {
                    setFiles(files => [...files, ...e.target.files!]);
                }}
            />
            {(files.length > 0 || reply) && <>
                <div
                    className={clsx("absolute inset-x-0 flex flex-col items-start justify-between gap-y-2 rounded-lg border border-gray-300 bg-gray-100 px-2 py-1",
                        files.length > 0 && reply ? "top-[-142px] h-[142x]" : reply ? "top-[-32px] h-[32px]" : "top-[-110px] h-[110px]")}>
                    {reply && <div className="flex w-full flex-row items-center justify-between">
                        <p className="shrink-0 truncate text-start w-[calc(100%-24px)] h-[24px]">
                            {/* reply content */}
                            <span className="text-sm text-gray-500">Answer for: </span>
                            {reply.content}
                        </p>
                        {/* "X" block to remove reply message */}
                        <div
                            className="flex cursor-pointer items-center justify-center rounded-lg bg-gray-300 h-[24px] w-[24px] hover:bg-gray-400"
                            onClick={() => setReply && setReply(reply)}
                        >
                            <RxCross1 className="text-sm text-gray-800"/>
                        </div>
                    </div>}
                    <div
                        className="flex flex-row items-center gap-x-4 overflow-x-auto">
                        {files.map(
                            (file, index) => <div
                                className="relative flex-shrink-0 rounded-md bg-gray-200 h-[100px]"
                                key={index}>

                                {/* display file base on type */}
                                <FilePreview src={file}/>

                                {/* delete button */}
                                <div
                                    className="absolute top-0 right-0 cursor-pointer rounded-lg bg-gray-300 h-[15px]
                                w-[15px] flex items-center justify-center hover:bg-gray-400"
                                    onClick={() => setFiles(files => files.filter(f => f != file))}>
                                    <RxCross1 className="text-sm text-gray-800"/>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </>}
            <form className="flex w-full items-center gap-x-4" onSubmit={handleSubmit}>
                <input type="text" name="content"
                       className="flex-auto appearance-none rounded-md border border-gray-300 bg-gray-200 px-2 py-1 text-lg shadow-sm placeholder-gray-400 focus:outline-none"
                       disabled={!writePermission}
                       placeholder="Enter message"
                       onKeyDown={() => setIsTyping(true)}
                       onKeyUp={() => {
                           keyTimer && clearTimeout(keyTimer);
                           keyTimer = setTimeout(() => setIsTyping(false), 2000);
                       }}/>
                <Button type="submit" disabled={!writePermission}>Send {" "} <FaPaperPlane className="inline"/>
                </Button>
            </form>
        </div>
    );
};