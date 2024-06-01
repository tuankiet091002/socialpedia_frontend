import {createApi} from "@reduxjs/toolkit/query/react";

import {MessageStatusType, Page, SocketType} from "@src/types.ts";
import {baseQueryWithReAuth} from "@utils/reauthQuery.ts";
import {InboxProfileRequest} from "@features/inbox/types/InboxProfileRequest.ts";
import {InboxResponse} from "@features/inbox/types/InboxResponse.ts";
import {InboxQueryRequest} from "@features/inbox/types/InboxQueryRequest.ts";
import {connect, subscribeTo} from "@utils/socketMessage.ts";
import {difference} from "@utils/arrayUtil.ts";
import {messageApi} from "@features/message/api.ts";
import moment from "moment/moment";
import {RootState} from "@src/main.tsx";
import {MessageQueryRequest} from "@features/message/types/MessageQueryRequest.ts";
import storage from "@utils/storage.ts";

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
                    [...result.content.map(({id}) => ({type: "Inbox" as const, id})),
                        {type: "Inbox", id: "LIST"}],
                async onQueryStarted(_, {queryFulfilled, getCacheEntry, dispatch, getState}) {
                    try {
                        await queryFulfilled;

                        // compare old and new cache
                        const addedInbox = difference<InboxResponse>(getCacheEntry().data?.content || [],
                            Array.from(inboxSet),
                            (a, b) => a.id === b.id);

                        await connect();

                        // add new inbox to set and subscribe to new one
                        await Promise.all(addedInbox.map(async inbox => {
                                inboxSet.add(inbox);

                                // get query related to that inbox
                                const query = (getState() as RootState).query.messageQuery.find((m: MessageQueryRequest) => m.locationId == inbox.id)

                                // fetch one when there are new message
                                await subscribeTo(`space/${inbox.id}`, (message) => {
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
                                                    query || {locationId: inbox.id, content: ""} as MessageQueryRequest,
                                                    data => {
                                                        data.content.unshift({
                                                            id: inbox.id * 1000 + message.owner.id * 10 + 3,
                                                            content: `${message.owner.name} is typing`,
                                                            resources: [],
                                                            status: MessageStatusType.SYSTEM,
                                                            modifiedDate: moment(Date.now()).toISOString(),
                                                            replies: []
                                                        });
                                                        return data;
                                                    }));
                                                break;

                                            case SocketType.STOP_TYPE:
                                                dispatch(messageApi.util?.updateQueryData("getMessageFromInbox",
                                                    query || {locationId: inbox.id, content: ""} as MessageQueryRequest,
                                                    data => ({
                                                        ...data, content: data.content.filter(m =>
                                                            m.id != inbox.id * 1000 + message.owner.id * 10 + 3)
                                                    })));
                                                break;

                                            case SocketType.SEEN:
                                                // only refresh if message is from different user
                                                if (storage.getUser().id != message.owner.id) {
                                                    dispatch(inboxApi.util?.invalidateTags([{
                                                        type: "Inbox",
                                                        id: `${inbox.id}_PROFILE`
                                                    }]));
                                                }
                                                break;

                                            default:
                                                break;
                                        }
                                    }
                                );
                            })
                        );
                    } catch
                        (err) {
                        console.log(err);
                    }
                }
                ,
                serializeQueryArgs: ({queryArgs, endpointName}) => {
                    return endpointName + "_" + queryArgs.name;
                },
                merge:
                    (currentCache, newItems) => {
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
            getInboxProfile: builder.query<InboxResponse, number>({
                query: (id) => ({
                    url: `/inbox/${id}`,
                    method: "GET"
                }),
                providesTags: (result) => [{type: "Inbox", id: result ? result.id : "LIST"}, {
                    type: "Inbox",
                    id: result ? `${result.id}_PROFILE` : "LIST"
                }]
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
                    method: "PUT",
                    body: content
                }),
                invalidatesTags: (_, __, {userId}) => [{type: "Inbox", id: userId}, {type: "Inbox", id: "LIST"}]
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

