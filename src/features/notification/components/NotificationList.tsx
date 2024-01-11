import {useEffect, useRef, useState} from "react";
import {NotificationQueryRequest} from "@features/notification/types/NotificationQueryRequest.ts";
import {useGetNotificationListQuery} from "@features/notification/api.ts";
import {NotificationItem} from "@features/notification/components/NotificationItem.tsx";

const INITIAL_PAGE = 3;

export const NotificationList = () => {
    //// SETTING VARIABLE
    // default query state without name field
    const initialState = {pageNo: 0, pageSize: INITIAL_PAGE};
    const [query, setQuery] = useState<NotificationQueryRequest>(initialState);

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
                    setQuery(query => ({...query, pageSize: query.pageSize + INITIAL_PAGE}));
                }
            };
            listScrollElement.addEventListener("scroll", onScroll);
            // clean-up
            return () => {
                listScrollElement.removeEventListener("scroll", onScroll);
            };
        }
    }, [data]);

    // // wait for next render when there is data
    if (!data) return null;

    return (
        <section
            className="absolute rounded-md border border-gray-300 bg-white p-2 shadow-xl bottom-[-500px] h-[500px] w-[400px] right-[20px]">
            <p className="text-start text-3xl">Notification List</p>
            <hr className="m-2 bg-gray-400"/>
            <ul className="overflow-y-auto space-y-2 h-[439.2px]" ref={listScrollRef}>
                {data.content.map(notification => <NotificationItem key={notification.id} data={notification}/>)}
                {data.content.map(notification => <NotificationItem key={notification.id} data={notification}/>)}
                {data.content.map(notification => <NotificationItem key={notification.id} data={notification}/>)}
                {data.content.map(notification => <NotificationItem key={notification.id} data={notification}/>)}
                {data.content.map(notification => <NotificationItem key={notification.id} data={notification}/>)}
            </ul>

        </section>
    );
};