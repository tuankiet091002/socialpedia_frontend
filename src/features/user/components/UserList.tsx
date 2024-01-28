import {UserResponse} from "@features/user/types";
import {createColumnHelper, getCoreRowModel, PaginationState, useReactTable} from "@tanstack/react-table";
import {useEffect, useMemo, useState} from "react";
import {useDisableUserMutation, useGetUserListQuery, useUpdateUserRoleMutation} from "@features/user/api.ts";
import {Link} from "react-router-dom";
import {CustomTable} from "@components/table/CustomTable.tsx";
import {Paginate} from "@components/table/Paginate.tsx";
import moment from "moment";
import {Avatar} from "@components/elements/Avatar.tsx";
import {HeaderWithSort} from "@components/table/HeaderWithSort.tsx";
import {IoFilter} from "react-icons/io5";
import {IoIosSearch, IoMdSettings} from "react-icons/io";
import {Button} from "@components/elements/Button.tsx";
import {ConfirmationDialog} from "@components/dialog/ConfirmationDialog.tsx";
import {IndependentInput} from "@components/elements/IndependentInput.tsx";

const columnHelper = createColumnHelper<UserResponse>();

const INITIAL_PAGE = 5

export const UserList = () => {

    // api hook
    const [updateRole, updateResult] = useUpdateUserRoleMutation();
    const [disableUser, disableResult] = useDisableUserMutation();

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
            orderBy?: "id" | "name" | "email" | "phone" | "dob" | "gender" | "role";
            orderDirection?: "ASC" | "DESC";
        }>({orderBy: "id" as const, orderDirection: "ASC" as const});
    // state for action dropdown
    const [userId, setUserId] = useState<number | undefined>();

    // main data
    const {data} = useGetUserListQuery({name, pageNo: pageIndex, pageSize, ...order});

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
        columnHelper.accessor(row => ({name: row.name, id: row.id, avatar: row.avatar}), {
            id: "name",
            header: () => <HeaderWithSort name="User" sortField="name" order={order} setOrder={setOrder}/>,
            cell: info => <Link to={`/user/${info.getValue().id}`}
                                className="cursor-pointer hover:text-blue-500">
                <Avatar src={info.getValue().avatar?.url} className="mr-1 inline" size="sm"/>
                {info.getValue().name}
            </Link>
        }),
        columnHelper.accessor("phone", {
            header: () => <HeaderWithSort name="Phone Number" sortField="phone" order={order} setOrder={setOrder}/>,
            cell: info => info.renderValue(),
            footer: info => info.column.id
        }),
        columnHelper.accessor("dob", {
            header: () => <HeaderWithSort name="Birthday" sortField="dob" order={order} setOrder={setOrder}/>,
            cell: info => <span>{moment(info.getValue()).format("DD/MM/YYYY")}</span>,
            footer: info => info.column.id
        }),
        columnHelper.accessor("gender", {
            header: () => <HeaderWithSort name="Gender" sortField="gender" order={order} setOrder={setOrder}/>,
            cell: info => <span>{info.getValue() ? "Nam" : "Nữ"}</span>,
            footer: info => info.column.id
        }),
        columnHelper.accessor("role", {
            header: () => <HeaderWithSort name="Role" sortField="role" order={order} setOrder={setOrder}/>,
            cell: info => <span>{info.getValue()?.name}</span>,
            footer: info => info.column.id
        }),
        columnHelper.accessor(row => ({id: row.id, role: row.role}), {
            id: "action",
            header: () => "Action",
            cell: info => <span className="relative w-2 !text-xl text-center !font-bold">
                <IoMdSettings className="inline cursor-pointer hover:text-blue-500"
                              onClick={() => setUserId(info.getValue().id)}/>
                {userId == info.getValue().id &&
                    <ul className="absolute -bottom-5 rounded-md border border-gray-300 bg-white p-1 text-base !font-normal left-[-100px] w-[220px]">
                        <ConfirmationDialog
                            isDone={updateResult.isSuccess}
                            type="info"
                            title="Change user role"
                            body={info.getValue().role!.name == "user" ? "Are you sure you want to change this user's role to admin? Admin have permission to access global data" : "Are you sure you want to change this user's role to user?  User lose permission to access global data."
                            }
                            triggerButton={<Button className="w-full !p-0 !border-0" size="md" variant="inverse">
                                Change role to {info.getValue().role!.name == "admin" ? "user" : "admin"}
                            </Button>}
                            confirmButton={
                                <Button variant="primary" onClick={() => updateRole({
                                    id: info.getValue().id,
                                    role: info.getValue().role!.name == "admin" ? "user" : "admin"
                                }).unwrap().then(() => {
                                    window.alert("Role updated successfully!");
                                    setUserId(undefined);
                                })}>
                                    Change
                                </Button>
                            }
                        />
                        <div className="my-1 w-full bg-gray-300 h-[1px]"></div>
                        <ConfirmationDialog
                            isDone={disableResult.isSuccess}
                            type="info"
                            title="Ban account"
                            body="Are you sure you want to ban this account? Banned account will not be useable and this can only be reverse by manually modify the database."
                            triggerButton={<Button className="w-full !py-0 !border-0" variant="inverse_danger"
                                                   size="md">
                                Ban account
                            </Button>}
                            confirmButton={
                                <Button variant="primary"
                                        onClick={() => disableUser(info.getValue().id).unwrap().then(() => {
                                            window.alert("Account banned!");
                                            setUserId(undefined);
                                        })}>
                                    Ban
                                </Button>
                            }
                        />
                    </ul>}
            </span>,
            footer: info => info.column.id
        })
    ], [order, userId]);

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
        <div className="w-full overflow-x-auto p-2">
            <div className="flex items-center border border-gray-300 px-3 text-start shadow-2xl h-[50px]">
                <IoFilter className="mr-3 inline"/>
                <span className="mr-3">Filter:</span>
                <IndependentInput textSize="sm" onChange={e => setTypingName(e.target.value)} endIcon={<IoIosSearch/>}/>
            </div>
            <CustomTable table={table}/>
            <hr className="h-6"/>
            <Paginate table={table}/>
        </div>
    );
};