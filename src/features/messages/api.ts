import {createApi} from '@reduxjs/toolkit/query/react'
import {
    MessageCreateRequest,
    MessageQueryRequest,
    MessageResponse,
    MessageUpdateRequest
} from "@features/messages/types";
import {Page} from "../../types.ts";
import {sendToChannel} from "@utils/socketMessage.ts";
import {baseQueryWithReAuth} from "@utils/reauthQuery.ts";

export const messageApi = createApi({
    reducerPath: "message",
    tagTypes: ["Message"],
    baseQuery: baseQueryWithReAuth,
    endpoints: (builder) => ({
        getMessages: builder.query<Page<MessageResponse>, MessageQueryRequest>({
            query: (query) => ({
                url: "/message",
                method: "GET",
                params: query
            }),
            providesTags: (result) => !result ? [{type: 'Message', id: "DUMMY"}] :
                [...result.content.map(({id}) => ({type: 'Message' as const, id})), {type: 'Message', id: "DUMMY"}],
        }),
        createMessage: builder.mutation<MessageResponse, MessageCreateRequest>({
            query: (body) => ({
                url: "/message",
                method: "POST",
                body
            }),
            async onQueryStarted(arg, {queryFulfilled}) {
                try {
                    await queryFulfilled;
                    sendToChannel(arg.channelId)

                } catch (err) {
                    console.log(err)
                }
            },
        }),
        updateMessage: builder.mutation<MessageResponse, MessageUpdateRequest>({
            query: (body) => ({
                url: "/message",
                method: "PUT",
                body
            }),
            invalidatesTags: (result) => result ? [{type: "Message", id: result.id}] : [{type: "Message", id: "DUMMY"}]
        }),
        deleteMessage: builder.mutation<void, string>({
            query: (query) => ({
                url: `/message/${query}`,
                method: "DELETE",
            }),
            invalidatesTags: [{type: "Message", id: "DUMMY"}]
        }),

    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useGetMessagesQuery,
    useCreateMessageMutation,
    useUpdateMessageMutation,
    useDeleteMessageMutation
} = messageApi

