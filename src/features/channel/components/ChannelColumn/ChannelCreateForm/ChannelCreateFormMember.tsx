import {Dispatch, SetStateAction, useEffect, useRef, useState} from "react";
import {ChannelCreateRequest} from "@features/channel/types/ChannelCreateRequest.ts";
import {useGetFriendListQuery} from "@features/user/api.ts";
import {ChannelMemberItem} from "@features/channel/components/ChannelColumn/ChannelCreateForm/ChannelMemberItem.tsx";
import {setScrollspy} from "@utils/setScrollspy.ts";
import {UserQueryRequest} from "@features/user/types";

type ChannelCreateFormMemberProps = {
    form: ChannelCreateRequest,
    setForm: Dispatch<SetStateAction<ChannelCreateRequest>>
}

export const ChannelCreateFormMember = ({form, setForm}: ChannelCreateFormMemberProps) => {
    //// SETTING VARIABLE
    const initialState = {name: "", pageNo: 0, pageSize: 3, orderBy: "id" as const, orderDirection: "ASC" as const}
    const [query, setQuery] = useState<UserQueryRequest>(initialState);
    // ref for scrollable div
    const listScrollRef = useRef<HTMLUListElement>(null);
    // main data
    const {data} = useGetFriendListQuery(query);

    // set up scrollspy
    useEffect(() => {
            return setScrollspy<HTMLUListElement>(listScrollRef, true,
                () => data && !data.last && setQuery(query => ({
                    ...query,
                    pageSize: query.pageSize + 1
                })));
        }
        , [data]);


    if (!data) return null;

    return (
        <div className="px-2">
            <p className="block text-start text-md">Choose channel members:</p>
            <div
                className="grid items-center border-gray-500 bg-gray-100 shadow-sm border-1 grid-cols-[80px_1fr_100px_100px] h-[30px] divide-gray-400 divide-x">
                <p className="text-center">Action</p>
                <p className="text-center">User</p>
                <p className="text-center">Message</p>
                <p className="text-center">Member</p>
            </div>
            <ul className="overflow-y-scroll h-[204.4px] divide-y divide-gray-300" ref={listScrollRef}>
                {data?.content.map(item =>
                    <ChannelMemberItem key={item.other.id} data={item.other}
                                       setForm={setForm}
                                       defaultValue={form.channelMembersId.find(m => m.memberId == item.other.id)}/>)}

            </ul>
        </div>

    );
};