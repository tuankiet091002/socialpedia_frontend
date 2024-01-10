import {ChangeEvent, useState} from "react";
import {useUpdateChannelAvatarMutation} from "@features/channel/api.ts";
import {ChannelResponse} from "@features/channel/types/ChannelResponse.ts";
import emptyAvatar from "@assets/empty avatar.jpg";

type ChannelAvatarFormProps = {
    data: ChannelResponse;
    edit: boolean
}

export const ChannelAvatarForm = ({data, edit}: ChannelAvatarFormProps) => {

    const [updateChannelAvatar] = useUpdateChannelAvatarMutation();
    const [isEdit, setIsEdit] = useState<boolean>(false);
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

    return (<div className="static left-[calc(50%-75px)] top-[20px] lg:absolute">
        <img src={edit && isEdit && file ? URL.createObjectURL(file) : data.avatar?.url}
             className="rounded-full border-white border-[5px] h-[150px]" alt={emptyAvatar}/>
        {/*{isEdit ? <div>*/}
        {/*        <input type="file" className="form-control" onChange={handleChange}/>*/}
        {/*        <Button onClick={handleSubmit} disabled={!file}>Save change</Button>*/}
        {/*        <Button onClick={() => setIsEdit(false)}>Cancel</Button>*/}
        {/*    </div>*/}
        {/*    : <Button onClick={() => setIsEdit(true)}>Edit Image</Button>}*/}
    </div>);
};