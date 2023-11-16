import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {
    MessageCreateRequest,
    MessageQueryRequest,
    MessageResponse,
    MessageUpdateRequest
} from "@features/messages/types";
import {Page} from "../../types.ts";
import {unionArray} from "@utils/unionArray.ts";
import {ChannelResponse} from "@features/channels";


export const messageApi = createApi({
    reducerPath: "message",
    tagTypes: ["Message"],
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost/message'}),
    endpoints: (builder) => ({
        getMessages: builder.query<Page<MessageResponse>, MessageQueryRequest>({
            query: (query) => ({
                url: "",
                method: "GET",
                params: query
            }),
            providesTags: (result) => !result ? [{type: 'Message', id: "DUMMY"}] :
                [...result.content.map(({id}) => ({type: 'Message' as const, id})), {type: 'Message', id: "DUMMY"}],
            serializeQueryArgs: ({endpointName, queryArgs}) => ({
                endpointName,
                channel: queryArgs.channel,
                content: queryArgs.content
            }),
            merge: (currentCache, newItems) => {
                if (newItems.content.length > 0) {
                    currentCache.content = unionArray<MessageResponse>(currentCache.content, newItems.content,
                        (a, b) => a.id === b.id);
                    currentCache.number = newItems.number
                    currentCache.first = newItems.first
                    currentCache.last = newItems.last
                }
            },
            forceRefetch({currentArg, previousArg}) {
                // compare two object content wise
                return JSON.stringify(currentArg) !== JSON.stringify(previousArg)
            },
        }),
        createMessage: builder.mutation<MessageResponse, MessageCreateRequest>({
            query: (body) => ({
                url: "",
                method: "POST",
                body
            }),
            invalidatesTags: [{type: "Message", id: 'DUMMY'}]
        }),
        updateMessage: builder.mutation<MessageResponse, MessageUpdateRequest>({
            query: (body) => ({
                url: "/",
                method: "PUT",
                body
            }),
            invalidatesTags: (result) => result ? [{type: "Message", id: result.id}] : [{type: "Message", id: "DUMMY"}]
        }),
        deleteMessage: builder.mutation<void, string>({
            query: (query) => ({
                url: `/${query}`,
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

