import {IndependentInput} from "@components/elements/IndependentInput.tsx";
import {IoIosSearch} from "react-icons/io";
import {useEffect, useRef, useState} from "react";
import {Spinner} from "@components/elements/Spinner.tsx";
import {Avatar} from "@components/elements/Avatar.tsx";
import {useGetOtherUserListQuery} from "@features/user/api.ts";
import {UserQueryRequest} from "@features/user/types";
import {useNavigate} from "react-router-dom";
import {useAuth} from "@src/hooks/useAuth.ts";

export const UserFinder = () => {

    const navigate = useNavigate();
    const [query, setQuery] = useState<UserQueryRequest>({name: "", pageNo: 0, pageSize: 7});
    const [immediateName, setImmediateName] = useState<string>("");

    // ref for scrollable div
    const listScrollRef = useRef<HTMLUListElement>(null);
    const {data, isFetching} = useGetOtherUserListQuery(query);
    const {data: owner} = useAuth();

    // only fetch using query after 500ms delay
    useEffect(() => {
        const timer = setTimeout(() => {
            // merge name into query
            setQuery({...query, name: immediateName});
        }, 500);

        return () => clearTimeout(timer);
    }, [immediateName]);

    if (!data) return null;

    return (
        <div className="grid grid-rows-[60px_1fr]">
            <div className="mb-2 flex w-full items-center justify-center border-b border-gray-400 p-2">
                <IndependentInput
                    textSize="md"
                    className="!w-full"
                    endIcon={<IoIosSearch/>}
                    onChange={(e) => setImmediateName(e.target.value)}
                    placeholder="Find other people"
                />
            </div>
            <ul className="overflow-y-scroll divide-y divide-gray-300" ref={listScrollRef}>
                {isFetching && <div><Spinner size="lg" className="mx-auto"/></div>}
                {data?.content.map(user =>
                    <li
                        className="flex cursor-pointer flex-row items-center justify-between gap-x-4 p-2 group hover:bg-blue-500 hover:text-white"
                        onClick={() => navigate(`/user/${user.id == owner!.id ? "profile" : user.id}`)}>
                        <Avatar className="bg-gray-50" src={user.avatar?.url} size="sm"/>
                        <p className="truncate">{user.name}</p>
                    </li>)}
            </ul>
        </div>
    );
}