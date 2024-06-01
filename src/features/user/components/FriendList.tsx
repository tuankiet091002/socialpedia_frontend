import {createColumnHelper, getCoreRowModel, PaginationState, useReactTable} from "@tanstack/react-table";
import {useEffect, useMemo, useState} from "react";
import {useGetFriendListQuery} from "@features/user/api.ts";
import {Link, useNavigate} from "react-router-dom";
import {CustomTable} from "@components/table/CustomTable.tsx";
import {Paginate} from "@components/table/Paginate.tsx";
import {Avatar} from "@components/elements/Avatar.tsx";
import {IoFilter} from "react-icons/io5";
import {IoIosSearch} from "react-icons/io";
import {IndependentInput} from "@components/elements/IndependentInput.tsx";
import {useAuth} from "@src/hooks/useAuth.ts";
import {GiThreeFriends} from "react-icons/gi";
import {UserFriendshipResponse} from "@features/user/types/UserFriendshipResponse.ts";
import moment from "moment/moment";
import {Button} from "@components/elements/Button.tsx";
import {useCreateInboxMutation} from "@features/inbox/api.ts";

const columnHelper = createColumnHelper<UserFriendshipResponse>();

const INITIAL_PAGE = 5

export const FriendList = () => {
    const navigate = useNavigate();
    // state for name filtering
    const [typingName, setTypingName] = useState<string>("");
    const [name, setName] = useState<string>("");
    // state for pagination only
    const [{pageIndex, pageSize}, setPagination] =
        useState<PaginationState>({
            pageIndex: 0,
            pageSize: INITIAL_PAGE
        });

    const [createInbox] = useCreateInboxMutation();

    // main data
    const {data} = useGetFriendListQuery({name, pageNo: pageIndex, pageSize});
    const {data: owner} = useAuth();

    const handleNavigateToMessage = (inboxId: number | null, userId: number) => {
        if (inboxId) {
            navigate(`/inbox/${inboxId}`)
        } else {
            createInbox(userId).unwrap()
                .then(() => {
                    window.alert("Inbox created.");
                    navigate(`/inbox`);
                })
        }
    }

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
        columnHelper.accessor(row => ({name: row.other.name, id: row.other.id, avatar: row.other.avatar}), {
            id: "name",
            header: () => <section className="flex flex-row items-center justify-center gap-x-2"> Name</section>,
            cell: info => <Link to={info.getValue().id != owner!.id ? `/user/${info.getValue().id}` : `/user/profile`}
                                className="cursor-pointer hover:text-blue-500">
                <Avatar src={info.getValue().avatar?.url} className="mr-1 inline" size="sm"/>
                {info.getValue().name}
            </Link>
        }),
        columnHelper.accessor("modifiedDate", {
            header: () => <section className="flex flex-row items-center justify-center gap-x-2"> Last
                changed</section>,
            cell: info => <span>{moment(info.getValue()).fromNow()}</span>
        }),
        columnHelper.accessor(row => ({userId: row.other.id, inboxId: row.inboxId}), {
            id: "inbox",
            header: () => "Inbox",
            cell: info => <div className="flex items-center justify-center">
                <Button type="button" onClick={() =>
                    handleNavigateToMessage(info.getValue().inboxId, info.getValue().userId)}>
                    {info.getValue().inboxId ? "Go to inbox" : "Create new inbox"}
                </Button>
            </div>,
            footer: info => info.column.id
        })
    ], []);

    // table definition
    const table = useReactTable({
        data: data?.content || [] as UserFriendshipResponse[],
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
        <div className="w-full overflow-x-auto p-2 space-y-1">
            <div
                className="flex flex-row items-center justify-between gap-x-2 border-gray-300 px-3 text-start h-[50px]">
                <GiThreeFriends className="inline rounded-md bg-blue-500 text-3xl text-white"/>
                <div className="mr-auto shrink-0 text-2xl">Friend List</div>
                <div className="flex flex-row items-center gap-3">
                    <IoFilter className="ms-auto"/>
                    <span>Filter:</span>
                    <IndependentInput textSize="md" endIcon={<IoIosSearch/>}
                                      onChange={e => setTypingName(e.target.value)}/>
                </div>

            </div>
            <CustomTable table={table}/>
            <div className="h-1"/>
            <Paginate table={table}/>
        </div>
    );
};