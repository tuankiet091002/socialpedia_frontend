import {ChannelResponse} from "@features/channel/types/ChannelResponse.ts";
import {
    createColumnHelper,
    getCoreRowModel,
    getPaginationRowModel,
    PaginationState,
    useReactTable
} from "@tanstack/react-table";
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
import {
    useAcceptChannelRequestMutation,
    useKickMemberMutation,
    useRejectChannelRequestMutation,
    useUpdateMemberPermissionMutation
} from "@features/channel/api.ts";
import {ChannelMemberRequest} from "@features/channel/types/ChannelMemberRequest.ts";
import {PermissionAccessType, RequestType} from "@src/types.ts";
import {useAuth} from "@src/hooks/useAuth.ts";

type ChannelMemberFormProps = {
    data: ChannelResponse;
    relation: ChannelMemberResponse | undefined;
    edit: boolean;
    setEdit: Dispatch<SetStateAction<boolean>>;
}

const columnHelper = createColumnHelper<ChannelMemberResponse>();

export const ChannelMemberForm = ({data, edit, relation}: ChannelMemberFormProps) => {

    // state for selected editing member
    const [member, setMember] = useState<ChannelMemberRequest | undefined>();
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 2
    })
    const {data: owner} = useAuth();

    // api hook
    const [updatePermission, updatePermissionResult] = useUpdateMemberPermissionMutation();
    const [acceptMemberRequest, acceptMemberResult] = useAcceptChannelRequestMutation();
    const [rejectMemberRequest, rejectMemberResult] = useRejectChannelRequestMutation();
    const [kickMember, kickMemberResult] = useKickMemberMutation();

    // column data
    const columns = useMemo(() => [
        columnHelper.accessor(row => ({id: row.member.id, avatar: row.member.avatar, name: row.member.name}), {
            id: "member",
            header: () => "User",
            cell: info => <Link
                to={`/user/${owner!.id != info.getValue().id ? info.getValue().id : "profile"}`}
                className="cursor-pointer hover:text-blue-500">
                <Avatar src={info.getValue().avatar?.url} className="mr-1 inline" size="sm"/>
                {info.getValue().name}
            </Link>,
            footer: info => info.column.id
        }),
        // if state = edit, show permission detail and edit button
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
                    {Object.keys(PermissionAccessType).filter(key => isNaN(Number(key)))
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
                    {Object.keys(PermissionAccessType).filter(key => isNaN(Number(key)))
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

                    {Object.keys(PermissionAccessType).filter(key => isNaN(Number(key)))
                        .map(item => <option key={item} value={item} className="text">{item}</option>)}
                </select>,
                footer: info => info.column.id
            }),
            // display edit switch if permission is sufficient
            ...relation && Number(PermissionAccessType[relation.memberPermission]) >= PermissionAccessType.MODIFY ?
                [columnHelper.accessor(row => row, {
                    id: "action",
                    header: () => "Action",
                    // can't change self permission, can't change creator's permission
                    cell: (info) => owner!.id != info.getValue().member.id &&
                        data.createdBy.id != info.getValue().member.id &&
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
                            info.getValue().status == RequestType.ACCEPTED ?
                                <div className="flex flex-col items-center justify-center gap-1">
                                    <ConfirmationDialog
                                        title="Change member role"
                                        body="Are you sure you want to change this member's role in the scope of this channel"
                                        isDone={updatePermissionResult.isSuccess}
                                        triggerButton={<Button size="sm" className="!px-2 text-xs">Save
                                            Permission</Button>}
                                        confirmButton={
                                            <Button type="button" size="sm" isLoading={updatePermissionResult.isLoading}
                                                    onClick={() => {
                                                        member && updatePermission({
                                                            channelId: data.id,
                                                            ...member
                                                        }).unwrap().then(() => {
                                                            window.alert("Permission updated successfully!")
                                                        }).finally(() => setMember(undefined))
                                                    }}>Save permission</Button>}
                                    />
                                    <ConfirmationDialog
                                        title="Kick member"
                                        type="danger"
                                        body="Are you sure you want to kick this member out of this channel, they can still ask to join again"
                                        isDone={kickMemberResult.isSuccess}
                                        triggerButton={<Button variant="danger" size="sm"
                                                               className="!px-2 text-xs">Kick</Button>}
                                        confirmButton={
                                            <Button type="button" variant="danger" size="sm"
                                                    isLoading={kickMemberResult.isLoading}
                                                    onClick={() => {
                                                        kickMember && kickMember({
                                                            channelId: data.id,
                                                            memberId: member?.memberId
                                                        }).unwrap().then(() => {
                                                            window.alert("Member kicked successfully!")
                                                        }).finally(() => setMember(undefined))
                                                    }}>Confirm</Button>}
                                    />
                                    <Button size="sm" variant="danger" className="!px-2 text-xs"
                                            onClick={() => setMember(undefined)}>Cancel</Button>
                                </div> :
                                <div className="flex flex-col items-center justify-center gap-1">
                                    <Button type="button" size="sm" className="!px-2 text-xs"
                                            onClick={() => acceptMemberRequest({
                                                channelId: data.id,
                                                memberId: member?.memberId
                                            }).unwrap().then(() => {
                                                window.alert("Join request accepted successfully!")
                                            }).finally(() => setMember(undefined))}
                                            isLoading={acceptMemberResult.isLoading}>
                                        Accept request
                                    </Button>
                                    <Button type="button" variant="danger" size="sm" className="!px-2 text-xs"
                                            onClick={() => rejectMemberRequest({
                                                channelId: data.id,
                                                memberId: member?.memberId
                                            }).unwrap().finally(() => setMember(undefined))}
                                            isLoading={rejectMemberResult.isLoading}>
                                        Reject request
                                    </Button>
                                </div>
                    }
            </span>,
                    footer: info => info.column.id
                })] : []] : [columnHelper.accessor(row => row.status, {
            id: "status",
            header: () => "Status",
            cell: info => <span>{info.getValue() == RequestType.ACCEPTED ? "Member" : "Request"}</span>,
            footer: info => info.column.id
        }),
            columnHelper.accessor(row => row.joinedDate, {
                id: "joinedDate",
                header: () => "Joined date",
                cell: info => <span>{info.getValue() ? moment(info.getValue()).format("DD/MM/YYYY") : "none"}</span>,
                footer: info => info.column.id
            })]
    ], [data, edit, member]);

    // table definition
    const table = useReactTable({
        data: data.channelMembers,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onPaginationChange: setPagination,
        state: {pagination},
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