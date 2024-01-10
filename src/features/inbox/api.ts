import {createApi} from "@reduxjs/toolkit/query/react";

import {Page, SocketType} from "@src/types.ts";
import {baseQueryWithReAuth} from "@utils/reauthQuery.ts";
import {InboxProfileRequest} from "@features/inbox/types/InboxProfileRequest.ts";
import {InboxResponse} from "@features/inbox/types/InboxResponse.ts";
import {InboxQueryRequest} from "@features/inbox/types/InboxQueryRequest.ts";
import {subscribeTo, unsubscribeTo} from "@utils/socketMessage.ts";
import {difference} from "@utils/arrayUtil.ts";
import {messageApi} from "@features/message/api.ts";
import {MessageQueryRequest} from "@features/message/types/MessageQueryRequest.ts";

const inboxSet = new Set<InboxResponse>();

export const inboxApi = createApi({
        reducerPath: "inbox",
        tagTypes: ["Inbox"],
        baseQuery: baseQueryWithReAuth,
        endpoints: (builder) => ({
            getInboxList: builder.query<Page<InboxResponse>, InboxQueryRequest>({
                query: (query) => ({
                    url: "/inbox",
                    method: "GET",
                    params: query
                }),
                providesTags: (result) => !result ? [{type: "Inbox", id: "LIST"}] :
                    [...result.content.map(({id}) => ({type: "Inbox" as const, id})), {type: "Inbox", id: "LIST"}],
                async onQueryStarted(_, {queryFulfilled, getCacheEntry, dispatch}) {
                    try {
                        await queryFulfilled;

                        // compare old and new cache
                        const addedInbox = difference<InboxResponse>(getCacheEntry().data?.content || [],
                            Array.from(inboxSet),
                            (a, b) => a.id === b.id);

                        // add new inbox to set and subscribe to new one
                        addedInbox.forEach(inbox => {

                            inboxSet.add(inbox);

                            // fetch one when there are new message
                            subscribeTo(`inbox/${inbox.id}`, (message) => {
                                    switch (message.type) {

                                        case (SocketType.CHAT):
                                            dispatch(inboxApi.util?.invalidateTags([{type: "Inbox", id: inbox.id}]));
                                            dispatch(messageApi.util?.invalidateTags([{
                                                type: "Message",
                                                id: inbox.id + "_LIST"
                                            }]));
                                            break;

                                        case SocketType.TYPE:
                                            dispatch(messageApi.util?.updateQueryData("getMessageFromInbox",
                                                {locationId: inbox.id} as MessageQueryRequest,
                                                data => {
                                                    data.content.push({
                                                        id: inbox.id * 1000 + Number(message.owner) * 10 + 3,
                                                        content: `${message.owner} is typing`,
                                                        createdBy: "System",
                                                        createdDate: new Date()
                                                    });
                                                    return data;
                                                }));
                                            break;

                                        case SocketType.STOP_TYPE:
                                            dispatch(messageApi.util?.updateQueryData("getMessageFromInbox",
                                                {locationId: inbox.id} as MessageQueryRequest,
                                                data => {
                                                    data.content.push({
                                                        id: inbox.id * 1000 + Number(message.owner) * 10 + 4,
                                                        content: `${message.owner} stop typing`,
                                                        createdBy: "System",
                                                        createdDate: new Date()
                                                    });
                                                    return data;
                                                }));
                                            break;
                                            
                                        default:
                                            break;
                                    }
                                }
                            );
                        });

                    } catch (err) {
                        console.log(err);
                    }
                },
                async onCacheEntryAdded(_, {cacheDataLoaded, cacheEntryRemoved}) {
                    try {
                        // wait for the initial query to resolve before proceeding
                        await cacheDataLoaded;

                    } catch (err) {
                        console.log(err);
                    }

                    // cacheEntryRemoved will resolve when the cache subscription is no longer active
                    await cacheEntryRemoved;
                    // unsubscribed to channel when cache is inactive
                    inboxSet.forEach((inbox) => unsubscribeTo(`inbox/${inbox.id}`));
                }
            }),
            getInboxProfile: builder.query<InboxResponse, number>({
                query: (id) => ({
                    url: `/inbox/${id}`,
                    method: "GET"
                }),
                providesTags: (result) => [{type: "Inbox", id: result ? result.id : "LIST"}]
            }),
            createInbox: builder.mutation<null, number>({
                query: (id) => ({
                    url: `/inbox/${id}`,
                    method: "POST"
                }),
                invalidatesTags: () => [{type: "Inbox", id: "LIST"}]
            }),
            updateInboxProfile: builder.mutation<void, InboxProfileRequest>({
                query: ({userId, ...content}) => ({
                    url: `/inbox/${userId}/profile`,
                    method: "GET",
                    body: content
                }),
                invalidatesTags: (_, __, {userId}) => [{type: "Inbox", id: userId}]
            })
        })
    }
);

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useGetInboxListQuery,
    useGetInboxProfileQuery,
    useCreateInboxMutation,
    useUpdateInboxProfileMutation
} = inboxApi;

