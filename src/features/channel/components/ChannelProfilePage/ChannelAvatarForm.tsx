import {Avatar} from "@components/elements/Avatar.tsx";
import {ChangeEvent, useState} from "react";
import {Button} from "@components/elements/Button.tsx";
import {useUpdateChannelAvatarMutation} from "@features/channel/api.ts";
import {ChannelResponse} from "@features/channel/types/ChannelResponse.ts";

type ChannelAvatarFormProps = {
    data: ChannelResponse
}

export const ChannelAvatarForm = ({data}: ChannelAvatarFormProps) => {
    const [updateChannelAvatar] = useUpdateChannelAvatarMutation();
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [file, setFile] = useState<File>();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files ? e.target.files[0] : null;
        if (selectedFile) {
            setFile(selectedFile);
        }
    }

    const handleSubmit = () => {
        if (file) updateChannelAvatar({channelId: data.id, avatarFile: file});
        window.alert("Channel avatar update successfully.")
    }

    return (<>
        <Avatar src={isEdit && file ? URL.createObjectURL(file) : data.avatar?.url} size="md"/>
        {isEdit ? <div>
                <input type="file" className="form-control" onChange={handleChange}/>
                <Button onClick={handleSubmit} disabled={!file}>Save change</Button>
                <Button onClick={() => setIsEdit(false)}>Cancel</Button>
            </div>
            : <Button onClick={() => setIsEdit(true)}>Edit Image</Button>}
    </>);
}