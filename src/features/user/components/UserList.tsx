import {UserResponse} from "@features/user/types";
import {createColumnHelper, getCoreRowModel, PaginationState, useReactTable} from "@tanstack/react-table";
import {useMemo, useState} from "react";
import {useGetUserListQuery} from "@features/user/api.ts";
import {CustomTable} from "@components/table/CustomTable.tsx";
import {Paginate} from "@components/table/Paginate.tsx";
import {Link} from "react-router-dom";

const columnHelper = createColumnHelper<UserResponse>()

export const UserList = () => {
    //// SETTING VARIABLES ////
    // default query state without name field
    // set function for pagination only
    const [{pageIndex, pageSize}, setPagination] =
        useState<PaginationState>({
            pageIndex: 0,
            pageSize: 1,
        })

    // main data
    const {data} = useGetUserListQuery({pageNo: pageIndex, pageSize, orderBy: "id", orderDirection: "ASC"});
    // column data
    const columns = useMemo(() => [
        columnHelper.accessor('name', {
            header: () => 'Full Name',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor("email", {
            header: () => 'Email',
            cell: info => <Link to={`./${encodeURIComponent(info.getValue()).replace(/\./g, '%2E')}`}>
                {info.getValue()}
            </Link>,
            footer: info => info.column.id,
        }),
        columnHelper.accessor('phone', {
            header: () => 'Phone number',
            cell: info => info.renderValue(),
            footer: info => info.column.id,
        }),
        columnHelper.accessor('dob', {
            header: () => "Birthday",
            cell: info => info.renderValue(),
            footer: info => info.column.id,
        }),
        columnHelper.accessor('gender', {
            header: () => 'Gender',
            cell: info => <span>{info.getValue() ? "Male" : "Female"}</span>,
            footer: info => info.column.id,
        }),
        columnHelper.accessor('role', {
            header: () => 'Role',
            cell: info => <span>{info.getValue()?.name}</span>,
            footer: info => info.column.id,
        }),
    ], [])
    // table definition
    const table = useReactTable({
        data: data?.content || [] as UserResponse[],
        columns,
        pageCount: data?.totalPages || -1,
        state: {pagination: {pageIndex, pageSize}},
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        debugTable: true,
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