import {createApi} from "@reduxjs/toolkit/dist/query/react";
import {baseQueryWithReAuth} from "@utils/reauthQuery.ts";
import {Page} from "@src/types.ts";
import {NotificationResponse} from "@features/notification/types/NotficationResponse.ts";
import {NotificationQueryRequest} from "@features/notification/types/NotificationQueryRequest.ts";
import {subscribeTo, unsubscribeTo} from "@utils/socketMessage.ts";
import storage from "@utils/storage.ts";


export const notificationApi = createApi({
    reducerPath: "notification",
    tagTypes: ["Notification"],
    baseQuery: baseQueryWithReAuth,
    endpoints: (builder) => ({
        getNotificationList: builder.query<Page<NotificationResponse>, NotificationQueryRequest>({
            query: (query) => ({url: "/notification", method: "GET", params: query}),
            providesTags: (result) => !result ? [{type: "Notification", id: "LIST"}] :
                [...result.content.map(({id}) => ({type: "Notification" as const, id})), {
                    type: "Notification",
                    id: "LIST"
                }],
            async onCacheEntryAdded(_, {dispatch, cacheDataLoaded, cacheEntryRemoved}) {

                // get current auth id
                const userId = storage.getUser().id;

                try {
                    await cacheDataLoaded;

                    subscribeTo(`/user/${userId}`, () =>
                        // if previous code not work because cache, use this
                        dispatch(notificationApi.util?.invalidateTags([{type: "Notification", id: "LIST"}]))
                    );
                } catch (err) {
                    console.log(err);
                }
                await cacheEntryRemoved;
                unsubscribeTo(`/user/${userId}`);
            }
        })
    })
});

export const {useGetNotificationListQuery} = notificationApi;