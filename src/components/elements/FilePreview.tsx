// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import {defaultStyles, FileIcon} from "react-file-icon";
import {Avatar} from "@components/elements/Avatar.tsx";
import {ResourceEntity} from "@src/types.ts";

type FilePreviewProps = {
    src: File | ResourceEntity;
    className?: string
}


export const FilePreview = ({src}: FilePreviewProps) => {

    const srcUrl = src instanceof File ? URL.createObjectURL(src) : src.url;
    const srcName = src instanceof File ? src.name : src.filename;
    const srcType = src instanceof File ? src.name.slice((Math.max(0, src.name.lastIndexOf(".")) || Infinity) + 1) : src.fileType;
    const srcSize = src instanceof File ? src.size : src.fileSize;


    return <a href={srcUrl} target="_blank">{
        srcType.startsWith("png") ?
            <Avatar src={srcUrl} size="md" className="rounded-none !w-auto"/> :
            // any other types
            <div className="flex flex-row justify-center gap-x-2">
                <div className="w-[76px]">
                    <FileIcon
                        // get file extension
                        extension={srcType}
                        {...defaultStyles[srcType]}
                        labelUppercase={false}/>
                </div>
                <div className="flex flex-col items-center justify-center gap-y-1">
                    <p className="font-semibold">{srcName}</p>
                    <p className="font-light">{(srcSize / 1024 / 1024 || 0).toFixed(2)} MB</p>
                </div>
            </div>
    }</a>
}