import {useEffect, useRef, useState} from "react";
import {NotificationQueryRequest} from "@features/notification/types/NotificationQueryRequest.ts";
import {useGetNotificationListQuery} from "@features/notification/api.ts";
import {NotificationItem} from "@features/notification/components/NotificationItem.tsx";

const INITIAL_PAGE = 3

export const NotificationList = () => {

    //// SETTING VARIABLE
    // default query state without name field
    const initialState = {pageNo: 0, pageSize: INITIAL_PAGE}
    const [query, setQuery] = useState<NotificationQueryRequest>(initialState)

    // ref for scrollable div
    const listScrollRef = useRef<HTMLUListElement>(null);
    // main data
    const {data} = useGetNotificationListQuery(query);

    // set up scrollspy
    useEffect(() => {
        const listScrollElement: HTMLUListElement | null = listScrollRef.current;

        if (listScrollElement) {
            const onScroll = () => {
                const {scrollTop, scrollHeight, clientHeight} = listScrollElement;
                const isNearBottom = scrollTop + clientHeight >= scrollHeight;

                if (data && isNearBottom && !data.last) {
                    setQuery(query => ({...query, pageSize: query.pageSize + INITIAL_PAGE}))
                }
            }
            listScrollElement.addEventListener("scroll", onScroll);
            // clean-up
            return () => {
                listScrollElement.removeEventListener("scroll", onScroll);
            };
        }
    }, [data]);

    // wait for next render when there is data
    if (!data) return null;

    return (
        <div className="dropdown">
            <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown"
                    aria-expanded="false">
                <div>dasd</div>
            </button>
            <ul className="dropdown-menu" ref={listScrollRef}>
                {data?.content.map(item => <NotificationItem key={item.id} data={item}/>)}
            </ul>
        </div>
    );
}