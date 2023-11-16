import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {
    ChannelCreateRequest,
    ChannelQueryRequest,
    ChannelResponse,
    ChannelUpdateRequest,
} from "@features/channels/types";
import {Page} from "../../types.ts";
import {unionArray} from "@utils/unionArray.ts";

export const channelApi = createApi({
    reducerPath: "channel",
    tagTypes: ["Channel"],
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost/channel'}),
    endpoints: (builder) => ({
        getChannels: builder.query<Page<ChannelResponse>, ChannelQueryRequest>({
            query: (query) => ({
                url: "",
                method: "GET",
                params: query
            }),
            providesTags: (result) => !result ? [{type: 'Channel', id: "DUMMY"}] :
                [...result.content.map(({id}) => ({type: 'Channel' as const, id})), {type: 'Channel', id: "DUMMY"}],
            serializeQueryArgs: ({endpointName, queryArgs}) => ({endpointName, name: queryArgs.name}),
            merge: (currentCache, newItems) => {
                if (newItems.content.length > 0) {
                    currentCache.content.push(...newItems.content)
                    currentCache.number = newItems.number
                    currentCache.first = newItems.first
                    currentCache.last = newItems.last
                }
            },
            forceRefetch({currentArg, previousArg}) {
                return currentArg !== previousArg
            },
        }),
        getOneChannel: builder.query<ChannelResponse, number>({
            query: (id) => ({
                url: `/${id}`,
                method: "GET",
            }),
            providesTags: (result) => [{type: 'Channel', id: result ? result.id : "DUMMY"}]
        }),
        createChannel: builder.mutation<ChannelResponse, ChannelCreateRequest>({
            query: (body) => ({
                url: "/",
                method: "GET",
                body
            }),
            invalidatesTags: [{type: "Channel", id: 'DUMMY'}]
        }),
        updateChannel: builder.mutation<ChannelResponse, ChannelUpdateRequest>({
            query: (body) => ({
                url: "/",
                method: "PUT",
                body
            }),
            invalidatesTags: (result) => result ? [{type: "Channel", id: result.id}] : [{type: "Channel", id: "DUMMY"}]
        }),
        deleteChannel: builder.mutation<void, string>({
            query: (query) => ({
                url: `/${query}`,
                method: "DELETE",
            }),
            invalidatesTags: [{type: "Channel", id: "DUMMY"}]
        }),

    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useGetChannelsQuery,
    useGetOneChannelQuery,
    useCreateChannelMutation,
    useUpdateChannelMutation,
    useDeleteChannelMutation
} = channelApi

