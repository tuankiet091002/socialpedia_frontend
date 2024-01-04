import {ChannelResponse} from "@features/channel/types/ChannelResponse.ts";
import {CustomTable} from "@components/table/CustomTable.tsx";
import {Paginate} from "@components/table/Paginate.tsx";
import {createColumnHelper, getCoreRowModel, getPaginationRowModel, useReactTable} from "@tanstack/react-table";
import {useMemo} from "react";
import {ChannelMemberResponse} from "@features/channel/types/ChannelMemberResponse.ts";
import {Avatar} from "@components/elements/Avatar.tsx";

type ChannelMemberFormProps = {
    data: ChannelResponse
}

const columnHelper = createColumnHelper<ChannelMemberResponse>()

export const ChannelMemberForm = ({data}: ChannelMemberFormProps) => {

    // column data
    const columns = useMemo(() => [
        columnHelper.accessor(row => row.member.avatar, {
            id: 'avatar',
            header: () => 'Avatar',
            cell: info => <Avatar src={info.getValue().url} size="sm"/>,
            footer: info => info.column.id,
        }),
        columnHelper.accessor(row => row.member.name, {
            id: 'name',
            header: () => 'Full Name',
            cell: info => info.getValue(),
            footer: info => info.column.id,
        }),
        columnHelper.accessor('memberPermission', {
            header: () => 'Member Permission',
            cell: info => info.renderValue(),
            footer: info => info.column.id,
        }),
        columnHelper.accessor('messagePermission', {
            header: () => "Message Permission",
            cell: info => info.renderValue(),
            footer: info => info.column.id,
        }),
    ], [])
    // table definition
    const table = useReactTable({
        data: data.channelMembers,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        debugTable: true,
        columnResizeMode: "onChange",
        columnResizeDirection: "ltr",
    })

    return (
        <div className="table table-striped border">
            <CustomTable table={table}/>
            <div className="h-2"/>
            <Paginate table={table}/>
        </div>
    );
}