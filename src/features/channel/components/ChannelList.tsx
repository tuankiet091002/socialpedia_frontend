import {createColumnHelper, getCoreRowModel, PaginationState, useReactTable} from "@tanstack/react-table";
import {ChannelResponse} from "@features/channel/types/ChannelResponse.ts";
import {useEffect, useMemo, useState} from "react";
import {CustomTable} from "@components/table/CustomTable.tsx";
import {Paginate} from "@components/table/Paginate.tsx";
import {useGetChannelListQuery} from "@features/channel/api.ts";
import moment from "moment";
import {Link} from "react-router-dom";
import {Avatar} from "@components/elements/Avatar.tsx";
import {HeaderWithSort} from "@components/table/HeaderWithSort.tsx";
import {IoFilter} from "react-icons/io5";
import {IoIosSearch} from "react-icons/io";
import {IndependentInput} from "@components/elements/IndependentInput.tsx";

const columnHelper = createColumnHelper<ChannelResponse>();
const INITIAL_PAGE = 5

export const ChannelList = () => {

    // state for name filtering
    const [typingName, setTypingName] = useState<string>("");
    const [name, setName] = useState<string>("");
    // state for pagination only
    const [{pageIndex, pageSize}, setPagination] =
        useState<PaginationState>({
            pageIndex: 0,
            pageSize: INITIAL_PAGE
        });
    // state for field ordering
    const [order, setOrder] =
        useState<{
            orderBy?: "id" | "name" | "createdBy" | "createdDate";
            orderDirection?: "ASC" | "DESC";
        }>({orderBy: "id" as const, orderDirection: "ASC" as const});

    // main data
    const {data} = useGetChannelListQuery({name, pageNo: pageIndex, pageSize, ...order});

    // filter input delay
    // only fetch using query after 500ms delay
    useEffect(() => {
        const timer = setTimeout(() => {
            // merge name into query
            setName(typingName);
            // set page back to 0
            setPagination((p) => ({...p, pageIndex: 0}))
        }, 500);

        return () => clearTimeout(timer);
    }, [typingName]);

    // column data
    const columns = useMemo(() => [
        columnHelper.accessor(row => ({name: row.name, avatar: row.avatar, id: row.id}), {
            id: "name",
            header: () => <HeaderWithSort name="Channel" sortField="name" order={order} setOrder={setOrder}/>,
            cell: info => <Link to={`/channel/${info.getValue().id}/profile`} className="hover:text-blue-500">
                <Avatar src={info.getValue().avatar?.url} className="mr-1 inline" size="sm"/>
                {info.getValue().name}
            </Link>
        }),
        columnHelper.accessor("createdBy", {
            header: () => <HeaderWithSort name="Creator" sortField="createdBy" order={order} setOrder={setOrder}/>,
            cell: info => <span>{info.getValue().name}</span>,
            footer: info => info.column.id
        }),
        columnHelper.accessor("createdDate", {
            header: () => <HeaderWithSort name="Created Date" sortField="createdDate" order={order}
                                          setOrder={setOrder}/>,
            cell: info => <span>{moment(info.getValue()).format("DD/MM/YYYY")}</span>,
            footer: info => info.column.id
        }),
        columnHelper.accessor("memberNum", {
            header: () => "Member number",
            cell: info => info.renderValue(),
            footer: info => info.column.id
        })
    ], [order]);

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
        <div className="w-full overflow-x-auto rounded-md border p-2 border-gray-300s space-y-1">
            <div className="flex items-center border-gray-300 px-3 text-start h-[50px] space-x-3">
                <IoFilter className="inline"/>
                <span>Filter:</span>
                <IndependentInput textSize="md" onChange={e => setTypingName(e.target.value)} endIcon={<IoIosSearch/>}/>
            </div>
            <CustomTable table={table}/>
            <hr className="h-1"/>
            <Paginate table={table}/>
        </div>
    );
};