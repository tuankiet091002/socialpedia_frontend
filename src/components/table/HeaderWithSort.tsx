import {Dispatch, SetStateAction} from "react";
import {GoTriangleDown, GoTriangleUp} from "react-icons/go";
import clsx from "clsx";

type HeaderWithSortProps<T> = {
    name: string,
    sortField: T,
    order: {
        orderBy?: T;
        orderDirection?: "ASC" | "DESC";
    }
    setOrder: Dispatch<SetStateAction<{
        orderBy?: T;
        orderDirection?: "ASC" | "DESC";
    }>>
}

export const HeaderWithSort = <T extends string>({name, sortField, order, setOrder}: HeaderWithSortProps<T>) => {

    // check field name, then config background and onClick function
    return <section className="flex flex-row items-center justify-center gap-x-2">
        {name}
        <div className="flex flex-col items-center justify-center">
            <GoTriangleUp
                className={clsx("-m-1 rounded-sm text-gray-600 ", (order.orderBy == sortField && order.orderDirection == "ASC") ? "text-[25px] text-black" : "cursor-pointer hover:bg-gray-300")}
                onClick={() => setOrder({...order, orderBy: sortField, orderDirection: "ASC"})}/>
            <GoTriangleDown
                className={clsx("-m-1 cursor-pointer rounded-sm text-gray-600", order.orderBy == sortField && order.orderDirection == "DESC" ? "text-[25px] text-black" : "cursor-pointer hover:bg-gray-300")}
                onClick={() => setOrder({...order, orderBy: sortField, orderDirection: "DESC"})}/>
        </div>
    </section>
}