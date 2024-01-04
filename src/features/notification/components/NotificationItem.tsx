import {NotificationResponse} from "@features/notification/types/NotficationResponse.ts";

type NotificationItemProps = {
    data: NotificationResponse;
}

export const NotificationItem = ({data}: NotificationItemProps) => {

    return (
        <div>item</div>
    )
}