import {useEffect, useRef, useState} from "react";
import {NotificationQueryRequest} from "@features/notification/types/NotificationQueryRequest.ts";
import {useGetNotificationListQuery} from "@features/notification/api.ts";
import {IoIosNotificationsOutline} from "react-icons/io";
import clsx from "clsx";

const INITIAL_PAGE = 3;

export const NotificationList = () => {
    //// SETTING VARIABLE
    // default query state without name field
    const initialState = {pageNo: 0, pageSize: INITIAL_PAGE};
    const [query, setQuery] = useState<NotificationQueryRequest>(initialState);
    const [show, setShow] = useState<boolean>(false);

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
    // if (!data) return null;

    return (
        <section>
            <div className="rounded-full bg-blue-400 p-1 hover:bg-blue-300" onClick={() => setShow(true)}>
                <IoIosNotificationsOutline className="cursor-pointer text-4xl font-bold text-white"/>
            </div>
            <div
                className={clsx("block fixed inset-0 bg-gray-800 ",
                    show ? "opacity-90 z-20" : "opacity-0 -z-10")}>
                <div
                    className={clsx("absolute right-0 h-screen w-1/3 transform bg-white p-2 transition duration-400",
                        show ? "translate-x-0" : "translate-x-full")}>
                    <section className="flex flex-row items-center justify-between p-2">
                        <p className="text-4xl">Notifications</p>
                        <button role="button" aria-label="close modal"
                                className="cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                onClick={() => setShow(false)}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18" stroke="#4B5563" strokeWidth="1.25" strokeLinecap="round"
                                      strokeLinejoin="round"/>
                                <path d="M6 6L18 18" stroke="#4B5563" strokeWidth="1.25" strokeLinecap="round"
                                      strokeLinejoin="round"/>
                            </svg>
                        </button>

                    </section>
                </div>
            </div>

        </section>
    );
};