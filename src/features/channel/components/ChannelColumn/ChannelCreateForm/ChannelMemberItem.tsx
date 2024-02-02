import {UserResponse} from "@features/user/types";
import {useNavigate} from "react-router-dom";
import {ChangeEvent, Dispatch, SetStateAction, useState} from "react";
import {ChannelCreateRequest} from "@features/channel/types/ChannelCreateRequest.ts";
import emptyAvatar from "@assets/empty avatar.jpg";
import {PermissionAccessType} from "@src/types.ts";
import {ChannelMemberRequest} from "@features/channel/types/ChannelMemberRequest.ts";

type ChannelMemberItemProps = {
    data: UserResponse
    defaultValue?: ChannelMemberRequest
    setForm: Dispatch<SetStateAction<ChannelCreateRequest>>
}

export const ChannelMemberItem = ({data, defaultValue, setForm}: ChannelMemberItemProps) => {
    const navigate = useNavigate();
    const [checked, setChecked] = useState<boolean>(!!defaultValue);
    const defaultPermission: ChannelMemberRequest = defaultValue || {
        memberId: data.id,
        channelPermission: "VIEW",
        memberPermission: "VIEW",
        messagePermission: "CREATE"
    };


    const handleCheck = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setForm(form => ({...form, channelMembersId: [...form.channelMembersId, defaultPermission]}));
            setChecked(true);
        } else {
            setForm(form => ({
                ...form,
                channelMembersId: form.channelMembersId.filter(m => m.memberId != data.id)
            }));
            setChecked(false);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setForm(form => ({
            ...form,
            channelMembersId: form.channelMembersId.map(x => x.memberId == data.id ? {
                ...x,
                [e.target.name]: e.target.value
            } : x)
        }));
    };


    return (
        <li className="grid flex-row items-center py-1 grid-cols-[80px_1fr_100px_100px]">
            <input type="checkbox" className="h-4 w-4 justify-self-center"
                   onChange={handleCheck} checked={!!defaultValue}/>
            <div className="flex cursor-pointer flex-row items-center gap-x-2 px-2 hover:bg-gray-400 hover:text-white"
                 onClick={() => navigate(`/user/${data.id}`)}>
                <img className="h-12 w-12 flex-none rounded-full bg-gray-50"
                     src={data.avatar?.url || emptyAvatar}
                     alt=""/>
                <p className="text-start font-semibold">{data.name}</p>
            </div>
            <select name="channelPermission"
                    className="w-3/4 justify-self-center rounded-sm border-gray-600 p-2 text-sm"
                    disabled={!checked}
                    onChange={handleChange}
                    defaultValue={defaultPermission.channelPermission}>
                {Object.keys(PermissionAccessType).filter(key => key != "NO_ACCESS" && isNaN(Number(key)))
                    .map(item => <option value={item}>{item}</option>)}
            </select>
            <select name="messagePermission"
                    className="w-3/4 justify-self-center rounded-sm border-gray-600 p-2 text-sm"
                    disabled={!checked}
                    onChange={handleChange}
                    defaultValue={defaultPermission.messagePermission}>
                {Object.keys(PermissionAccessType).filter(key => key != "NO_ACCESS" && isNaN(Number(key)))
                    .map(item => <option value={item}>{item}</option>)}
            </select>
            <select name="memberPermission"
                    className="w-3/4 justify-self-center rounded-sm border-gray-600 p-2 text-sm"
                    disabled={!checked}
                    onChange={handleChange}
                    defaultValue={defaultPermission.memberPermission}>
                {Object.keys(PermissionAccessType).filter(key => key != "NO_ACCESS" && isNaN(Number(key)))
                    .map(item => <option value={item}>{item}</option>)}
            </select>
        </li>
    );
};