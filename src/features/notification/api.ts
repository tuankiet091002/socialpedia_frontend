import {createApi} from "@reduxjs/toolkit/dist/query/react";
import {baseQueryWithReAuth} from "@utils/reauthQuery.ts";
import {Page} from "@src/types.ts";
import {NotificationResponse} from "@features/notification/types/NotficationResponse.ts";
import {NotificationQueryRequest} from "@features/notification/types/NotificationQueryRequest.ts";

export const notificationApi = createApi({
    reducerPath: "notification",
    baseQuery: baseQueryWithReAuth,
    endpoints: (builder) => ({
        getNotificationList: builder.query<Page<NotificationResponse>, NotificationQueryRequest>({
            query: (query) => ({url: "/notification", method: "GET", params: query})
        }),
    })
})

export const {useGetNotificationListQuery} = notificationApi;