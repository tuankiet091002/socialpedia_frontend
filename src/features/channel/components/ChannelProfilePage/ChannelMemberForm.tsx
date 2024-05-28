import {ChannelResponse} from "@features/channel/types/ChannelResponse.ts";
import {createColumnHelper, getCoreRowModel, getPaginationRowModel, useReactTable} from "@tanstack/react-table";
import {Dispatch, SetStateAction, useMemo, useState} from "react";
import {ChannelMemberResponse} from "@features/channel/types/ChannelMemberResponse.ts";
import {Link} from "react-router-dom";
import {CustomTable} from "@components/table/CustomTable.tsx";
import {Paginate} from "@components/table/Paginate.tsx";
import {Avatar} from "@components/elements/Avatar.tsx";
import {IoMdSettings} from "react-icons/io";
import moment from "moment";
import {Button} from "@components/elements/Button.tsx";
import {ConfirmationDialog} from "@components/dialog/ConfirmationDialog.tsx";
import {useUpdateMemberPermissionMutation} from "@features/channel/api.ts";
import {ChannelMemberRequest} from "@features/channel/types/ChannelMemberRequest.ts";
import {PermissionAccessType} from "@src/types.ts";
import {useAuth} from "@src/hooks/useAuth.ts";

type ChannelMemberFormProps = {
    data: ChannelResponse;
    edit: boolean;
    setEdit: Dispatch<SetStateAction<boolean>>;
}

const columnHelper = createColumnHelper<ChannelMemberResponse>();

export const ChannelMemberForm = ({data, edit}: ChannelMemberFormProps) => {

    // state for selected editing member
    const [member, setMember] = useState<ChannelMemberRequest | undefined>();
    const {data: owner} = useAuth();

    // api hook
    const [updatePermission, updatePermissionResult] = useUpdateMemberPermissionMutation();

    // column data
    const columns = useMemo(() => [
        columnHelper.accessor(row => ({id: row.member.id, avatar: row.member.avatar, name: row.member.name}), {
            id: "member",
            header: () => "Thành viên",
            cell: info => <Link
                to={owner!.id != info.getValue().id ? `/channel/${info.getValue().id}/profile` : "/user/profile"}
                className="cursor-pointer hover:text-blue-500">
                <Avatar src={info.getValue().avatar?.url} className="mr-1 inline" size="sm"/>
                {info.getValue().name}
            </Link>,
            footer: info => info.column.id
        }),
        columnHelper.accessor(row => row.joinedDate, {
            id: "joinedDate",
            header: () => "Joined date",
            cell: info => <span>{moment(info.getValue()).format("DD/MM/YYYY")}</span>,
            footer: info => info.column.id
        }),
        ...edit ? [
            columnHelper.accessor(row => ({memberId: row.member.id, channelPermission: row.channelPermission}), {
                id: "channelPermission",
                header: () => "Channel permission",
                cell: info => <select
                    className="text-lg"
                    defaultValue={info.getValue().memberId == member?.memberId ? member?.channelPermission : info.getValue().channelPermission}
                    disabled={info.getValue().memberId != member?.memberId}
                    onChange={
                        e => member && setMember({...member, channelPermission: e.target.value})}
                >
                    {Object.keys(PermissionAccessType).filter(key => key != "NO_ACCESS" && isNaN(Number(key)))
                        .map(item => <option key={item} value={item}>{item}</option>)}
                </select>,
                footer: info => info.column.id
            }),
            columnHelper.accessor(row => ({memberId: row.member.id, memberPermission: row.memberPermission}), {
                id: "memberPermission",
                header: () => "Member permission",
                cell: info => <select
                    className="text-lg"
                    defaultValue={info.getValue().memberId == member?.memberId ? member?.memberPermission : info.getValue().memberPermission}
                    disabled={info.getValue().memberId != member?.memberId}
                    onChange={
                        e => member && setMember({...member, memberPermission: e.target.value})}>
                    {Object.keys(PermissionAccessType).filter(key => key != "NO_ACCESS" && isNaN(Number(key)))
                        .map(item => <option key={item} value={item.toString()}>{item}</option>)}
                </select>,
                footer: info => info.column.id
            }),
            columnHelper.accessor(row => ({memberId: row.member.id, messagePermission: row.messagePermission}), {
                id: "messagePermission",
                header: () => "Message permission",
                cell: info => <select
                    className="text-lg"
                    defaultValue={info.getValue().memberId == member?.memberId ? member?.messagePermission : info.getValue().messagePermission}
                    disabled={info.getValue().memberId != member?.memberId}
                    onChange={
                        e => member && setMember({...member, messagePermission: e.target.value})}
                >

                    {Object.keys(PermissionAccessType).filter(key => key != "NO_ACCESS" && isNaN(Number(key)))
                        .map(item => <option key={item} value={item} className="text">{item}</option>)}
                </select>,
                footer: info => info.column.id
            }),
            // if state = edit, show permission detail and edit button
            columnHelper.accessor(row => row, {
                id: "action",
                header: () => "Action",
                cell: (info) => owner!.id != info.getValue().member.id &&
                    <span className="!text-xl text-center !font-bold">
                    {
                        info.getValue().member.id != member?.memberId ?
                            <IoMdSettings className="inline cursor-pointer hover:text-blue-500"
                                          onClick={() => setMember({
                                              memberId: info.getValue().member.id,
                                              channelPermission: info.getValue().channelPermission.toString(),
                                              memberPermission: info.getValue().memberPermission.toString(),
                                              messagePermission: info.getValue().messagePermission.toString()
                                          })}/> :
                            <div className="flex flex-col items-center justify-center gap-1">
                                <ConfirmationDialog
                                    title="Change member role"
                                    body="Are you sure you want to change this member's role in the scope of this channel"
                                    isDone={updatePermissionResult.isSuccess}
                                    triggerButton={<Button size="sm">Save</Button>}
                                    confirmButton={
                                        <Button type="button" size="sm" isLoading={updatePermissionResult.isLoading}
                                                onClick={() => {
                                                    member && updatePermission({
                                                        channelId: data.id,
                                                        ...member
                                                    }).unwrap().then(() => {
                                                        window.alert("Permission updated successfully!")
                                                    }).finally(() => setMember(undefined))
                                                }}>Save</Button>}
                                />
                                <Button variant="danger" size="sm"
                                        onClick={() => setMember(undefined)}>Cancel</Button>
                            </div>

                    }
            </span>,
                footer: info => info.column.id
            })] : []
    ], [data, edit, member]);

    // table definition
    const table = useReactTable({
        data: data.channelMembers,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        debugTable: true,
        columnResizeMode: "onChange"
    });

    return (
        <div className="overflow-y-auto">
            <CustomTable table={table}/>
            <hr className="h-6"/>
            <Paginate table={table}/>
        </div>
    );
};