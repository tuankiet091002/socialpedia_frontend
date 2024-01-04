import {createApi} from '@reduxjs/toolkit/query/react'

import {Page} from "@src/types.ts";
import {baseQueryWithReAuth} from "@utils/reauthQuery.ts";
import {InboxProfileRequest} from "@features/inbox/types/InboxProfileRequest.ts";
import {ChannelResponse} from "@features/channel/types/ChannelResponse.ts";
import {ChannelQueryRequest} from "@features/channel/types/ChannelQueryRequest.ts";

export const inboxApi = createApi({
        reducerPath: "inbox",
        tagTypes: ["Inbox"],
        baseQuery: baseQueryWithReAuth,
        endpoints: (builder) => ({
            getInboxList: builder.query<Page<ChannelResponse>, ChannelQueryRequest>({
                query: (query) => ({
                    url: "/inbox",
                    method: "GET",
                    params: query
                }),
                providesTags: (result) => !result ? [{type: 'Inbox', id: "DUMMY"}] :
                    [...result.content.map(({id}) => ({type: 'Inbox' as const, id})), {type: 'Inbox', id: "DUMMY"}],
            }),
            createInbox: builder.mutation<null, number>({
                query: (id) => ({
                    url: `/inbox/${id}`,
                    method: "POST",
                }),
                invalidatesTags: () => [{type: 'Inbox', id: "DUMMY"}]
            }),
            updateInboxProfile: builder.mutation<void, InboxProfileRequest>({
                query: ({userId, ...content}) => ({
                    url: `/inbox/${userId}/profile`,
                    method: "GET",
                    body: content
                }),
                invalidatesTags: (_, __, {userId}) => [{type: 'Inbox', id: userId}]
            }),
        }),
    }
)

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useGetInboxListQuery,
    useCreateInboxMutation,
    useUpdateInboxProfileMutation
} = inboxApi

