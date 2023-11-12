import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {
    ChannelCreateRequest,
    ChannelQueryRequest,
    ChannelResponse,
    ChannelUpdateRequest,
} from "@features/channels/types.ts";

export const channelApi = createApi({
    reducerPath: "group",
    tagTypes: ["Group"],
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:3000/group'}),
    endpoints: (builder) => ({
        getGroups: builder.query<ChannelResponse[], ChannelQueryRequest>({
            query: (query) => ({
                url: "/",
                method: "GET",
                params: query
            }),
            providesTags: (result) => !result ? [{type: 'Group', id: "LIST"}] :
                [...result.map(({id}) => ({type: 'Group' as const, id})), {type: 'Group', id: "LIST"}]
        }),
        createGroup: builder.mutation<ChannelResponse, ChannelCreateRequest>({
            query: (body) => ({
                url: "/",
                method: "GET",
                body
            }),
            invalidatesTags: [{type: "Group", id: 'LIST'}]
        }),
        updateGroup: builder.mutation<ChannelResponse, ChannelUpdateRequest>({
            query: (body) => ({
                url: "/",
                method: "PUT",
                body
            }),
            invalidatesTags: (result) => result ? [{type: "Group", id: result.id}] : [{type: "Group", id: "LIST"}]
        }),
        deleteGroup: builder.mutation<void, string>({
            query: (query) => ({
                url: `/${query}`,
                method: "DELETE",
            }),
            invalidatesTags: [{type: "Group", id: "LIST"}]
        }),

    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useGetGroupsQuery,
    useCreateGroupMutation,
    useUpdateGroupMutation,
    useDeleteGroupMutation
} = channelApi

