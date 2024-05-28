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

type MessageInputProps = {
    queryFunc: UseMutation<MutationDefinition<
        MessageCreateRequest,
        BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
        "Message",
        void,
        "message">>;
}

export const MessageInput = ({queryFunc}: MessageInputProps) => {
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

        createMessage({locationId: Number(locationId), content: content, files: files});

        (e.target as typeof e.target & { content: { value: string } }).content.value = "";
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
            <label htmlFor="messageFileInput" className="flex items-center p-1 shadow-sm rounded-md cursor-pointer
            bg-gray-200 hover:bg-gray-400">
                <MdAttachFile className="text-3xl"/>
            </label>
            <input
                id="messageFileInput"
                type="file"
                className="hidden"
                multiple={true}
                onChange={(e) => {
                    setFiles(files => [...files, ...e.target.files!]);
                }}
            />
            {files.length > 0 &&
                <div
                    className="absolute inset-x-0 flex flex-row items-center gap-x-4 overflow-x-auto rounded-lg border border-gray-300 bg-gray-100 px-2 top-[-120px] h-[120px]">
                    {files.map(
                        (file, index) => <div className="relative flex-shrink-0 rounded-md bg-gray-200 p-1 h-[100px]"
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
                </div>}
            <form className="flex w-full items-center gap-x-4" onSubmit={handleSubmit}>
                <input type="text" name="content"
                       className="flex-auto appearance-none rounded-md border border-gray-300 bg-gray-200 px-2 py-1 text-lg shadow-sm placeholder-gray-400 focus:outline-none"
                       placeholder="Enter message"
                       onKeyDown={() => setIsTyping(true)}
                       onKeyUp={() => {
                           keyTimer && clearTimeout(keyTimer);
                           keyTimer = setTimeout(() => setIsTyping(false), 2000);
                       }}/>
                <Button type="submit">Send {" "} <FaPaperPlane className="inline"/> </Button>
            </form>

        </div>
    );
};