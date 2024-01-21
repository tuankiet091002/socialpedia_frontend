import {ChangeEvent, useState} from "react";
import {useUpdateChannelAvatarMutation} from "@features/channel/api.ts";
import {ChannelResponse} from "@features/channel/types/ChannelResponse.ts";
import {Button} from "@components/elements/Button.tsx";
import {IoIosSettings} from "react-icons/io";
import {Avatar} from "@components/elements/Avatar.tsx";

type ChannelAvatarFormProps = {
    data: ChannelResponse;
    edit: boolean
}

export const ChannelAvatarForm = ({data, edit}: ChannelAvatarFormProps) => {

    const [updateChannelAvatar] = useUpdateChannelAvatarMutation();
    const [file, setFile] = useState<File>();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files ? e.target.files[0] : null;
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleSubmit = () => {
        if (file) updateChannelAvatar({channelId: data.id, avatarFile: file});
        window.alert("Channel avatar update successfully.");
    };

    return (<div className="relative left-[calc(50%-75px)] top-[20px] lg:absolute">
        <Avatar src={file && URL.createObjectURL(file) || data.avatar?.url}
                className=" border-white border-[5px] h-[150px]" size="lg"/>
        {edit &&
            <label>
                <IoIosSettings
                    className="absolute right-2 cursor-pointer rounded-full border-blue-600 bg-blue-600 text-3xl text-white top-[110px] border-[3px]"/>
                <input
                    type="file"
                    className="hidden"
                    onChange={handleChange}
                />
                {file &&
                    <div
                        className="absolute inset-x-auto bottom-3 mt-2 flex w-full justify-center gap-x-2 left-[-150px]">
                        <Button type="button" size="sm"
                                className="!px-0" onClick={handleSubmit}>Save</Button>
                        <Button type="button" variant="danger" size="sm"
                                className="!px-0" onClick={() => setFile(undefined)}>Cancel</Button>
                    </div>}
            </label>
        }
    </div>);
};