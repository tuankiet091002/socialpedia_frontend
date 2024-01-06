import {ChangeEvent, useState} from "react";
import {useUpdateAvatarMutation} from "@features/auth/api.ts";
import emptyAvatar from "@assets/empty avatar.webp"

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

    return (<div className="static left-20 top-[20px] lg:absolute">
        <img src={isEdit && file ? URL.createObjectURL(file) : defaultUrl}
             className="rounded-full border-white border-[5px] h-[150px]" alt={emptyAvatar}/>
        {/*{isEdit ? <div>*/}
        {/*        <input type="file" className="form-control" onChange={handleChange}/>*/}
        {/*        <Button onClick={handleSubmit} disabled={!file}>Save change</Button>*/}
        {/*        <Button onClick={() => setIsEdit(false)}>Cancel</Button>*/}
        {/*    </div>*/}
        {/*    : <Button onClick={() => setIsEdit(true)}>Edit Image</Button>}*/}
    </div>);
}