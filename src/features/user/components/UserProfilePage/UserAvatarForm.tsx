import {ChangeEvent, useState} from "react";
import {useUpdateAvatarMutation} from "@features/auth/api.ts";
import {IoIosSettings} from "react-icons/io";
import {Button} from "@components/elements/Button.tsx";
import {Avatar} from "@components/elements/Avatar.tsx";

type AvatarFormProps = {
    defaultUrl: string,
    edit: boolean
}

export const UserAvatarForm = ({edit, defaultUrl}: AvatarFormProps) => {
    const [updateAvatar] = useUpdateAvatarMutation();
    const [file, setFile] = useState<File>();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files ? e.target.files[0] : null;
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleSubmit = () => {
        if (file) updateAvatar(file).unwrap().then(() => {
            setFile(undefined);
            window.alert("Profile updated successfully.");
        });
    };

    return (<div className="static left-20 top-[20px] lg:absolute">
        <div className="relative">
            <Avatar src={file && URL.createObjectURL(file) || defaultUrl} size="lg"
                    className="rounded-full border-white border-[5px]"/>
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
                            className="absolute inset-x-auto mt-2 flex w-full justify-center gap-x-2 bottom-[-30px] lg:right-[-150px] lg:bottom-3">
                            <Button type="button" size="sm"
                                    className="!px-0" onClick={handleSubmit}>Save</Button>
                            <Button type="button" variant="danger" size="sm"
                                    className="!px-0" onClick={() => setFile(undefined)}>Cancel</Button>
                        </div>}
                </label>
            }
        </div>
    </div>);
};