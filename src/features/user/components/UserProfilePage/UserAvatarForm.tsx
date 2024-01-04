import {Avatar} from "@components/elements/Avatar.tsx";
import {ChangeEvent, useState} from "react";
import {Button} from "@components/elements/Button.tsx";
import {useUpdateAvatarMutation} from "@features/auth/api.ts";

type AvatarFormProps = {
    defaultUrl: string
}

export const UserAvatarForm = ({defaultUrl}: AvatarFormProps) => {
    const [updateAvatar] = useUpdateAvatarMutation();
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [file, setFile] = useState<File>();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files ? e.target.files[0] : null;
        if (selectedFile) {
            setFile(selectedFile);
        }
    }

    const handleSubmit = () => {
        if (file) updateAvatar(file);
        window.alert("Profile update successfully.")
    }

    return (<>
        <Avatar src={isEdit && file ? URL.createObjectURL(file) : defaultUrl} size="md"/>
        {isEdit ? <div>
                <input type="file" className="form-control" onChange={handleChange}/>
                <Button onClick={handleSubmit} disabled={!file}>Save change</Button>
                <Button onClick={() => setIsEdit(false)}>Cancel</Button>
            </div>
            : <Button onClick={() => setIsEdit(true)}>Edit Image</Button>}
    </>);
}