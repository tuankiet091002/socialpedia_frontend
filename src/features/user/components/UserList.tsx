import {UserResponse} from "@features/user/types";
import {createColumnHelper, getCoreRowModel, PaginationState, useReactTable} from "@tanstack/react-table";
import {useMemo, useState} from "react";
import {useGetUserListQuery} from "@features/user/api.ts";
import {Link} from "react-router-dom";
import {CustomTable} from "@components/table/CustomTable.tsx";
import {Paginate} from "@components/table/Paginate.tsx";
import moment from "moment";
import {HiDotsVertical} from "react-icons/hi";
import {Avatar} from "@components/elements/Avatar.tsx";

const columnHelper = createColumnHelper<UserResponse>();

const INITIAL_PAGE = 5

export const UserList = () => {
    //// SETTING VARIABLES ////
    // default query state without name field
    // set function for pagination only
    const [{pageIndex, pageSize}, setPagination] =
        useState<PaginationState>({
            pageIndex: 0,
            pageSize: INITIAL_PAGE
        });

    // main data
    const {data} = useGetUserListQuery({pageNo: pageIndex, pageSize, orderBy: "id", orderDirection: "ASC"});
    // column data
    const columns = useMemo(() => [
        columnHelper.accessor(row => ({name: row.name, id: row.id, avatar: row.avatar}), {
            id: "name",
            header: () => "User",
            cell: info => <Link to={`/user/${info.getValue().id}`}
                                className="cursor-pointer hover:text-blue-500">
                <Avatar src={info.getValue().avatar?.url} className="mr-1 inline" size="sm"/>
                {info.getValue().name}
            </Link>
        }),
        columnHelper.accessor("phone", {
            header: () => "Phone number",
            cell: info => info.renderValue(),
            footer: info => info.column.id
        }),
        columnHelper.accessor("dob", {
            header: () => "Birthdate",
            cell: info => <span>{moment(info.getValue()).format("DD/MM/YYYY")}</span>,
            footer: info => info.column.id
        }),
        columnHelper.accessor("gender", {
            header: () => "Gender",
            cell: info => <span>{info.getValue() ? "Nam" : "Nữ"}</span>,
            footer: info => info.column.id
        }),
        columnHelper.accessor("role", {
            header: () => "Role",
            cell: info => <span>{info.getValue()?.name}</span>,
            footer: info => info.column.id
        }),
        columnHelper.accessor("id", {
            header: () => "",
            cell: () => <span className="w-2 !text-xl text-center !font-bold">
                <HiDotsVertical className="inline cursor-pointer hover:text-blue-500"/>
            </span>,
            footer: info => info.column.id
        })
    ], []);
    // table definition
    const table = useReactTable({
        data: data?.content || [] as UserResponse[],
        columns,
        pageCount: data?.totalPages || -1,
        state: {pagination: {pageIndex, pageSize}},
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        columnResizeMode: "onChange",
        manualPagination: true,
        debugTable: true
    });

    if (!data) return null;

    return (
        <div className="w-full overflow-x-auto">
            <CustomTable table={table}/>
            <hr className="h-6"/>
            <Paginate table={table}/>
        </div>
    );
};