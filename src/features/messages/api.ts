import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {
    MessageCreateRequest,
    MessageQueryRequest,
    MessageResponse,
    MessageUpdateRequest
} from "@features/messages/types.ts";

export const messageApi = createApi({
    reducerPath: "chat",
    tagTypes: ["Chat"],
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:3000/chat'}),
    endpoints: (builder) => ({
        getMessages: builder.query<MessageResponse[], MessageQueryRequest>({
            query: (query) => ({
                url: "/",
                method: "GET",
                params: query
            }),
            providesTags: (result) => !result ? [{type: 'Chat', id: "LIST"}] :
                [...result.map(({id}) => ({type: 'Chat' as const, id})), {type: 'Chat', id: "LIST"}]
        }),
        createMessage: builder.mutation<MessageResponse, MessageCreateRequest>({
            query: (body) => ({
                url: "/",
                method: "GET",
                body
            }),
            invalidatesTags: [{type: "Chat", id: 'LIST'}]
        }),
        updateMessage: builder.mutation<MessageResponse, MessageUpdateRequest>({
            query: (body) => ({
                url: "/",
                method: "PUT",
                body
            }),
            invalidatesTags: (result) => result ? [{type: "Chat", id: result.id}] : [{type: "Chat", id: "LIST"}]
        }),
        deleteMessage: builder.mutation<void, string>({
            query: (query) => ({
                url: `/${query}`,
                method: "DELETE",
            }),
            invalidatesTags: [{type: "Chat", id: "LIST"}]
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

