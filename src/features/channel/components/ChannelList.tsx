import {createColumnHelper, getCoreRowModel, PaginationState, useReactTable} from "@tanstack/react-table";
import {ChannelResponse} from "@features/channel/types/ChannelResponse.ts";
import {useMemo, useState} from "react";
import {CustomTable} from "@components/table/CustomTable.tsx";
import {Paginate} from "@components/table/Paginate.tsx";
import {useGetChannelListQuery} from "@features/channel/api.ts";
import moment from "moment";
import {Link} from "react-router-dom";
import {Avatar} from "@components/elements/Avatar.tsx";

const columnHelper = createColumnHelper<ChannelResponse>();
const INITIAL_PAGE = 5

export const ChannelList = () => {

    //// SETTING VARIABLES ////
    // default query state without name field
    // set function for pagination only
    const [{pageIndex, pageSize}, setPagination] =
        useState<PaginationState>({
            pageIndex: 0,
            pageSize: INITIAL_PAGE
        });

    // main data
    const {data} = useGetChannelListQuery({pageNo: pageIndex, pageSize, orderBy: "id", orderDirection: "ASC"});
    // column data
    const columns = useMemo(() => [
        columnHelper.accessor(row => ({name: row.name, avatar: row.avatar, id: row.id}), {
            id: "name",
            header: () => "Channel",
            cell: info => <Link to={`/channel/${info.getValue().id}/profile`} className="hover:text-blue-500">
                <Avatar src={info.getValue().avatar?.url} className="mr-1 inline" size="sm"/>
                {info.getValue().name}
            </Link>
        }),
        columnHelper.accessor("createdBy", {
            header: () => "Creator",
            cell: info => <span>{info.getValue().name}</span>,
            footer: info => info.column.id
        }),
        columnHelper.accessor("createdDate", {
            header: () => "Created date",
            cell: info => <span>{moment(info.getValue()).format("DD/MM/YYYY")}</span>,
            footer: info => info.column.id
        }),
        columnHelper.accessor("memberNum", {
            header: () => "Member number",
            cell: info => info.renderValue(),
            footer: info => info.column.id
        })
    ], []);
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
        columnResizeDirection: "ltr"
    });

    if (!data) return null;

    return (
        <div className="w-full">
            <CustomTable table={table}/>
            <hr className="h-6"/>
            <Paginate table={table}/>
        </div>
    );
};