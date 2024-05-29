import {Dispatch, SetStateAction, useEffect, useRef} from "react";
import {NotificationQueryRequest} from "@features/notification/types/NotificationQueryRequest.ts";
import {useSeenAllNotificationMutation} from "@features/notification/api.ts";
import {NotificationItem} from "@features/notification/components/NotificationItem.tsx";
import {setScrollspy} from "@utils/setScrollspy.ts";
import {Page} from "@src/types.ts";
import {NotificationResponse} from "@features/notification/types/NotficationResponse.ts";

const INITIAL_PAGE = 6;

type NotificationListProps = {
    data: Page<NotificationResponse>
    setQuery: Dispatch<SetStateAction<NotificationQueryRequest>>
}

export const NotificationList = ({data, setQuery}: NotificationListProps) => {
    //// SETTING VARIABLE

    // ref for scrollable div
    const listScrollRef = useRef<HTMLUListElement>(null);
    // main data
    const [seenAll] = useSeenAllNotificationMutation();

    // set up scrollspy
    useEffect(() => {
        return setScrollspy<HTMLUListElement>(listScrollRef, true,
            () => data && !data.last && setQuery(query => ({
                ...query,
                pageSize: query.pageSize + INITIAL_PAGE
            })));
    }, [data]);

    // wait for next render when there is data
    if (!data) return null;

    return (
        <section
            className="absolute z-30 rounded-md border border-gray-300 bg-white p-2 shadow-xl bottom-[-440px] h-[440px] w-[400px] right-[20px]">
            <p className="text-start text-3xl">Notification List</p>
            <hr className="m-2 bg-gray-400"/>
            <ul className="overflow-y-auto h-[339.2px]" ref={listScrollRef}>
                {data.content.map(notification => <NotificationItem key={notification.id} data={notification}/>)}
            </ul>
            <div className="flex items-center justify-center border-t-2 border-gray-300 h-[40px]">
                <p className="cursor-pointer text-blue-500 hover:text-blue-600"
                   onClick={() => seenAll(null)}>
                    Seen all notifications
                </p>
            </div>
        </section>
    );
};