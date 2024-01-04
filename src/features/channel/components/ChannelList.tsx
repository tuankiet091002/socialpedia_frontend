import {createColumnHelper, getCoreRowModel, PaginationState, useReactTable} from "@tanstack/react-table";
import {ChannelResponse} from "@features/channel/types/ChannelResponse.ts";
import {useMemo, useState} from "react";
import {CustomTable} from "@components/table/CustomTable.tsx";
import {Paginate} from "@components/table/Paginate.tsx";
import {useGetChannelListQuery} from "@features/channel/api.ts";
import moment from "moment";
import {Link} from "react-router-dom";

const columnHelper = createColumnHelper<ChannelResponse>()

export const ChannelList = () => {

    //// SETTING VARIABLES ////
    // default query state without name field
    // set function for pagination only
    const [{pageIndex, pageSize}, setPagination] =
        useState<PaginationState>({
            pageIndex: 0,
            pageSize: 1,
        })

    // main data
    const {data} = useGetChannelListQuery({pageNo: pageIndex, pageSize, orderBy: "id", orderDirection: "ASC"});
    // column data
    const columns = useMemo(() => [
        columnHelper.accessor('name', {
            header: () => 'Full Name',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor("avatar", {
            header: () => 'Avatar',
            cell: info => <span>{info.getValue().filename}</span>,
            footer: info => info.column.id,
        }),
        columnHelper.accessor('createdBy', {
            header: () => 'Creator',
            cell: info => <span>{info.getValue().name}</span>,
            footer: info => info.column.id,
        }),
        columnHelper.accessor('createDate', {
            header: () => "Created Date",
            cell: info => <span>{moment(info.getValue()).fromNow()}</span>,
            footer: info => info.column.id,
        }),
        columnHelper.accessor('id', {
            header: () => "",
            cell: info => <Link to={`/channels/${info.getValue()}/profile`}><a>View</a></Link>,
            footer: info => info.column.id,
        }),
    ], [])
    // table definition
    const table = useReactTable({
        data: data?.content || [] as ChannelResponse[],
        columns,
        pageCount: data?.totalPages || -1,
        state: {pagination: {pageIndex, pageSize}},
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        debugTable: true,
        columnResizeMode: "onChange",
        columnResizeDirection: "ltr",
    })

    if (!data) return null;

    return (
        <div className="table table-striped border border-2">
            <CustomTable table={table}/>
            <div className="h-2"/>
            <Paginate table={table}/>
        </div>
    )
}