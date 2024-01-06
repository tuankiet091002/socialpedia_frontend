import {ChannelResponse} from "@features/channel/types/ChannelResponse.ts";
import {createColumnHelper, getCoreRowModel, getPaginationRowModel, useReactTable} from "@tanstack/react-table";
import {useMemo} from "react";
import {ChannelMemberResponse} from "@features/channel/types/ChannelMemberResponse.ts";
import {Link} from "react-router-dom";
import {CustomTable} from "@components/table/CustomTable.tsx";
import {Paginate} from "@components/table/Paginate.tsx";
import {HiDotsVertical} from "react-icons/hi";

type ChannelMemberFormProps = {
    data: ChannelResponse;
    edit: boolean;
}

const columnHelper = createColumnHelper<ChannelMemberResponse>()

export const ChannelMemberForm = ({data, edit}: ChannelMemberFormProps) => {

    // column data
    const columns = useMemo(() => [
        columnHelper.accessor(row => ({email: row.member.email, avatar: row.member.avatar, name: row.member.name}), {
            id: 'member',
            header: () => 'Thành viên',
            cell: info => <Link to={`/user/${encodeURIComponent(info.getValue().email).replace(/\./g, '%2E')}`}
                                className="cursor-pointer hover:text-blue-500">
                <img src={info.getValue().avatar?.url} className="mr-1 inline h-10 w-10" alt="Avatar"/>
                {info.getValue().name}
            </Link>,
            footer: info => info.column.id,
        }),
        columnHelper.accessor('memberPermission', {
            header: () => 'Member Permission',
            cell: info => info.renderValue(),
            footer: info => info.column.id,
        }),
        columnHelper.accessor('messagePermission', {
            header: () => " Message Permission",
            cell: info => info.renderValue(),
            footer: info => info.column.id,
        }),
        ...!edit ? [columnHelper.accessor(row => ({id: row.member.id}), {
            id: "action",
            header: () => "Action",
            cell: () => <span className="!text-xl text-center !font-bold">
                <HiDotsVertical class="inline cursor-pointer hover:text-blue-500"/>
            </span>,
            footer: info => info.column.id,
        })] : [],
    ], [])
    // table definition
    const table = useReactTable({
        data: data.channelMembers,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        debugTable: true,
        columnResizeMode: "onChange"
    })

    return (
        <div className="w-full">
            <CustomTable table={table}/>
            <hr className="h-6"/>
            <Paginate table={table}/>
        </div>
    );
}