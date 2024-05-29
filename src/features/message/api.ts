import {createApi} from "@reduxjs/toolkit/query/react";
import {MessageStatusType, Page} from "@src/types.ts";
import {baseQueryWithReAuth} from "@utils/reauthQuery.ts";
import {MessageResponse} from "@features/message/types/MessageResponse.ts";
import {MessageQueryRequest} from "@features/message/types/MessageQueryRequest.ts";
import {MessageCreateRequest} from "@features/message/types/MessageCreateRequest.ts";
import {MessageContentRequest} from "@features/message/types/MessageContentRequest.ts";
import {MessageStatusRequest} from "@features/message/types/MessageStatusRequest.ts";
import {RootState} from "@src/main.tsx";

export const messageApi = createApi({
    reducerPath: "message",
    tagTypes: ["Message"],
    baseQuery: baseQueryWithReAuth,
    endpoints: (builder) => ({
        getMessageFromChannel: builder.query<Page<MessageResponse>, MessageQueryRequest>({
            query: ({locationId, ...content}) => ({
                url: `/message/channel/${locationId}`,
                method: "GET",
                params: content
            }),
            providesTags: (result, _, {locationId}) => !result ? [{type: "Message", id: locationId + "_LIST"}] :
                [...result.content.map(({id}) => ({type: "Message" as const, id: locationId + "_" + id})),
                    {type: "Message", id: locationId + "_LIST"}],
            serializeQueryArgs: ({queryArgs, endpointName}) => {
                return endpointName + "_" + queryArgs.locationId + "_" + queryArgs.content;
            },
            merge: (currentCache, newItems) => {
                // setting variable
                const numberDifference = newItems.totalElements - currentCache.totalElements;
                const size = currentCache.size;

                if (numberDifference <= size) {
                    // splice logic
                    currentCache.content.splice(Math.max(newItems.number * size - numberDifference, 0),
                        newItems.number == 0 ? size - numberDifference : size, ...newItems.content);
                    // other fields
                    currentCache.totalElements = newItems.totalElements
                    currentCache.last = newItems.last
                    currentCache.totalPages = newItems.totalPages
                } else {
                    console.log("overflowing number of element")
                }
            },
            forceRefetch({currentArg, previousArg}) {
                return JSON.stringify(currentArg) !== JSON.stringify(previousArg);
            }
        }),
        getMessageFromInbox: builder.query<Page<MessageResponse>, MessageQueryRequest>({
            query: ({locationId, ...content}) => ({
                url: `/message/inbox/${locationId}`,
                method: "GET",
                params: content
            }),
            providesTags: (result, _, {locationId}) => !result ? [{type: "Message", id: locationId + "_LIST"}] :
                [...result.content.map(({id}) => ({type: "Message" as const, id: locationId + id})),
                    {type: "Message", id: locationId + "_LIST"}],
            serializeQueryArgs: ({queryArgs, endpointName}) => {
                return endpointName + "_" + queryArgs.locationId + "_" + queryArgs.content;
            },
            merge: (currentCache, newItems) => {
                // setting variable
                const numberDifference = newItems.totalElements - currentCache.totalElements;
                const size = currentCache.size;

                if (numberDifference <= size) {
                    // splice logic
                    currentCache.content.splice(Math.max(newItems.number * size - numberDifference, 0),
                        newItems.number == 0 ? size - numberDifference : size, ...newItems.content);
                    // other fields
                    currentCache.totalElements = newItems.totalElements
                    currentCache.last = newItems.last
                    currentCache.totalPages = newItems.totalPages
                } else {
                    console.log("overflowing number of element")
                }

            },
            forceRefetch({currentArg, previousArg}) {
                return JSON.stringify(currentArg) !== JSON.stringify(previousArg);
            }
        }),
        sendMessageToChannel: builder.mutation<void, MessageCreateRequest>({
            query: ({locationId, files, ...content}) => {

                const formData = new FormData();
                files.forEach(file => formData.append("files", file, file.name));
                formData.append("content", JSON.stringify(content));

                return ({
                    url: `/message/channel/${locationId}`,
                    method: "POST",
                    body: formData
                });
            }
        }),
        sendMessageToInbox: builder.mutation<void, MessageCreateRequest>({
            query: ({locationId, files, ...content}) => {
                const formData = new FormData();
                files.forEach(file => formData.append("files", file));
                formData.append("content", JSON.stringify(content));

                return ({
                    url: `/message/inbox/${locationId}`,
                    method: "POST",
                    body: formData
                });
            }
        }),
        updateMessageContent: builder.mutation<void, MessageContentRequest>({
            query: ({locationId, ...body}) => ({
                url: `/message/${locationId}/content`,
                method: "PUT",
                body: body
            }),
            async onQueryStarted({id, locationId, content}, {dispatch, queryFulfilled, getState}) {

                try {
                    await queryFulfilled

                    const query = (getState() as RootState).query.messageQuery.find((m: MessageQueryRequest) => m.locationId == locationId)

                    // optimistic update for channel if exist
                    dispatch(messageApi.util.updateQueryData("getMessageFromChannel",
                        query!,
                        data => ({
                            ...data, content: data.content.map(m =>
                                m.id != id ? m : {...m, content})
                        })));

                    // optimistic update for inbox if exist
                    dispatch(messageApi.util.updateQueryData("getMessageFromInbox",
                        query!,
                        data => ({
                            ...data, content: data.content.map(m =>
                                m.id != id ? m : {...m, content})
                        })));
                } catch (e) {
                    console.log(e)
                }
            }
        }),
        updateMessageStatus: builder.mutation<void, MessageStatusRequest>({
            query: ({locationId, ...body}) => ({
                url: `/message/${locationId}/status`,
                method: "PUT",
                body: body
            }),
            async onQueryStarted({id, locationId, status}, {dispatch, queryFulfilled, getState}) {

                try {
                    await queryFulfilled

                    const query = (getState() as RootState).query.messageQuery.find((m: MessageQueryRequest) => m.locationId == locationId)

                    // optimistic update for channel if exist
                    dispatch(messageApi.util.updateQueryData("getMessageFromChannel",
                        query!,
                        data => ({
                            ...data, content: data.content.map(m =>
                                m.id != id ? m : {...m, status})
                        })));

                    // optimistic update for inbox if exist
                    dispatch(messageApi.util.updateQueryData("getMessageFromInbox",
                        query!,
                        data => ({
                            ...data, content: data.content.map(m =>
                                m.id != id ? m : {...m, status})
                        })));

                } catch (e) {
                    console.log(e)
                }
            }
        }),
        deleteMessage: builder.mutation<void, { locationId: number, id: number }>({
            query: ({locationId, id}) => ({
                url: `/message/${locationId}/${id}`,
                method: "DELETE"
            }),
            async onQueryStarted({id, locationId}, {dispatch, queryFulfilled, getState}) {

                try {
                    await queryFulfilled

                    const query = (getState() as RootState).query.messageQuery.find((m: MessageQueryRequest) => m.locationId == locationId)

                    // pessimistic for channel if exist
                    dispatch(messageApi.util.updateQueryData("getMessageFromChannel",
                        query!,
                        data => ({
                            ...data, content: data.content.map(m =>
                                m.id != id ? m : {...m, status: MessageStatusType.INACTIVE})
                        })));

                    // pessimistic for inbox if exist
                    dispatch(messageApi.util.updateQueryData("getMessageFromInbox",
                        query!,
                        data => ({
                            ...data, content: data.content.map(m =>
                                m.id != id ? m : {...m, status: MessageStatusType.INACTIVE})
                        })));

                } catch (e) {
                    console.log(e)
                }
            }
        })

    })
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useGetMessageFromChannelQuery,
    useGetMessageFromInboxQuery,
    useSendMessageToChannelMutation,
    useSendMessageToInboxMutation,
    useUpdateMessageContentMutation,
    useUpdateMessageStatusMutation,
    useDeleteMessageMutation
} = messageApi;

