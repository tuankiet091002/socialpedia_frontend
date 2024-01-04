import {createApi} from '@reduxjs/toolkit/query/react'
import {Page} from "@src/types.ts";
import {baseQueryWithReAuth} from "@utils/reauthQuery.ts";
import {MessageResponse} from "@features/message/types/MessageResponse.ts";
import {MessageQueryRequest} from "@features/message/types/MessageQueryRequest.ts";
import {MessageCreateRequest} from "@features/message/types/MessageCreateRequest.ts";
import {MessageContentRequest} from "@features/message/types/MessageContentRequest.ts";
import {MessageStatusRequest} from "@features/message/types/MessageStatusRequest.ts";

export const messageApi = createApi({
    reducerPath: "message",
    tagTypes: ["Message"],
    baseQuery: baseQueryWithReAuth,
    endpoints: (builder) => ({
        getMessageFromChannel: builder.query<Page<MessageResponse>, MessageQueryRequest>({
            query: (query) => ({
                url: "/message",
                method: "GET",
                params: query
            }),
            providesTags: (result) => !result ? [{type: 'Message', id: "DUMMY"}] :
                [...result.content.map(({id}) => ({type: 'Message' as const, id})), {type: 'Message', id: "DUMMY"}],
        }),
        getMessageFromInbox: builder.query<Page<MessageResponse>, MessageQueryRequest>({
            query: (query) => ({
                url: "/message",
                method: "GET",
                params: query
            }),
            providesTags: (result) => !result ? [{type: 'Message', id: "DUMMY"}] :
                [...result.content.map(({id}) => ({type: 'Message' as const, id})), {type: 'Message', id: "DUMMY"}],
        }),
        sendMessageToChannel: builder.mutation<void, MessageCreateRequest>({
            query: ({locationId, files, ...content}) => {
                const formData = new FormData();
                files.forEach(file => formData.append("files[]", file))
                formData.append("content", JSON.stringify(content))

                return ({
                    url: `/message/channel/${locationId}`,
                    method: "POST",
                    body: formData
                })
            },
            invalidatesTags: () => [{type: "Message", id: "DUMMY"}]
        }),
        sendMessageToInbox: builder.mutation<void, MessageCreateRequest>({
            query: ({locationId, files, ...content}) => {
                const formData = new FormData();
                files.forEach(file => formData.append("files[]", file))
                formData.append("content", JSON.stringify(content))

                return ({
                    url: `/message/inbox/${locationId}`,
                    method: "POST",
                    body: formData
                })
            },
            invalidatesTags: () => [{type: "Message", id: "DUMMY"}]
        }),
        updateMessageContent: builder.mutation<void, MessageContentRequest>({
            query: ({locationId, id, ...status}) => ({
                url: `/message/${locationId}/${id}/content`,
                method: "PUT",
                body: status
            }),
            invalidatesTags: (_, __, {id}) => [{type: "Message", id: id}]
        }),
        updateMessageStatus: builder.mutation<void, MessageStatusRequest>({
            query: ({locationId, id, ...status}) => ({
                url: `/message/${locationId}/${id}/status`,
                method: "PUT",
                body: status
            }),
            invalidatesTags: (_, __, {id}) => [{type: "Message", id: id}]
        }),
        deleteMessage: builder.mutation<void, { locationId: number, messageId: number }>({
            query: ({locationId, messageId}) => ({
                url: `/message/${locationId}/${messageId}`,
                method: "DELETE",
            }),
            invalidatesTags: [{type: "Message", id: "DUMMY"}]
        }),

    }),
})

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
} = messageApi

