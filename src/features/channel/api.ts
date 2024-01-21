import {createApi} from "@reduxjs/toolkit/query/react";
import {Page, SocketType} from "@src/types.ts";
import {difference} from "@utils/arrayUtil.ts";
import {connect, subscribeTo, unsubscribeTo} from "@utils/socketMessage.ts";
import {baseQueryWithReAuth} from "@utils/reauthQuery.ts";
import {ChannelResponse} from "@features/channel/types/ChannelResponse.ts";
import {ChannelQueryRequest} from "@features/channel/types/ChannelQueryRequest.ts";
import {ChannelCreateRequest} from "@features/channel/types/ChannelCreateRequest.ts";
import {ChannelProfileRequest} from "@features/channel/types/ChannelProfileRequest.ts";
import {ChannelAvatarRequest} from "@features/channel/types/ChannelAvatarRequest.ts";
import {ChannelMemberRequest} from "@features/channel/types/ChannelMemberRequest.ts";
import {messageApi} from "@features/message/api.ts";
import {MessageQueryRequest} from "@features/message/types/MessageQueryRequest.ts";
import moment from "moment";
import {notificationApi} from "@features/notification/api.ts";

const channelSet = new Set<ChannelResponse>();

export const channelApi = createApi({
        reducerPath: "channel",
        tagTypes: ["Channel"],
        baseQuery: baseQueryWithReAuth,
        endpoints: (builder) => ({
            getChannelList: builder.query<Page<ChannelResponse>, ChannelQueryRequest>({
                query: (query) => ({
                    url: "/channel",
                    method: "GET",
                    params: query
                }),
                providesTags: (result) => !result ? [{type: "Channel", id: "LIST"}] :
                    [...result.content.map(({id}) => ({type: "Channel" as const, id})), {
                        type: "Channel",
                        id: "LIST"
                    }]
            }),
            getPersonalChannelList: builder.query<Page<ChannelResponse>, ChannelQueryRequest>({
                query: (query) => ({
                    url: "/channel/self",
                    method: "GET",
                    params: query
                }),
                providesTags: (result) => !result ? [{type: "Channel", id: "LIST"}] :
                    [...result.content.map(({id}) => ({type: "Channel" as const, id})), {
                        type: "Channel",
                        id: "LIST"
                    }],
                async onQueryStarted(_, {queryFulfilled, getCacheEntry, dispatch}) {
                    try {
                        await queryFulfilled;

                        // compare old and new cache
                        const addedChannel = difference<ChannelResponse>(getCacheEntry().data?.content || [], Array.from(channelSet), (a, b) => a.id === b.id);

                        await connect();

                        // add new channel to channelSet and subscribe to new channel
                        await Promise.all(addedChannel.map(async (channel) => {

                            channelSet.add(channel);

                            // fetch one when there are new message
                            await subscribeTo(`space/${channel.id}`, (message) => {

                                    switch (message.type) {
                                        case (SocketType.CHAT):
                                            dispatch(channelApi.util?.invalidateTags([{type: "Channel", id: channel.id}]));
                                            dispatch(messageApi.util?.invalidateTags([{
                                                type: "Message",
                                                id: channel.id + "_LIST"
                                            }]));
                                            break;

                                        case SocketType.JOIN:
                                            dispatch(messageApi.util?.updateQueryData("getMessageFromChannel",
                                                {locationId: channel.id} as MessageQueryRequest,
                                                data => {
                                                    data.content.push({
                                                        id: channel.id * 1000 + message.owner.id * 10 + 2,
                                                        content: `${message.owner.name} just join the channel`,
                                                        resources: [],
                                                        createdBy: "System",
                                                        modifiedDate: moment(Date.now()).toISOString()
                                                    });
                                                    return data;
                                                }));
                                            break;

                                        case SocketType.LEAVE:
                                            dispatch(messageApi.util?.updateQueryData("getMessageFromChannel",
                                                {locationId: channel.id} as MessageQueryRequest,
                                                data => {
                                                    data.content.unshift({
                                                        id: channel.id * 1000 + message.owner.id * 10 + 2,
                                                        content: `${message.owner.name} just leave the channel`,
                                                        resources: [],
                                                        createdBy: "System",
                                                        modifiedDate: moment(Date.now()).toISOString()
                                                    });
                                                    return data;
                                                }));
                                            break;

                                        case SocketType.TYPE:
                                            dispatch(messageApi.util?.updateQueryData("getMessageFromChannel",
                                                {locationId: channel.id} as MessageQueryRequest,
                                                data => {
                                                    data.content.unshift({
                                                        id: channel.id * 1000 + message.owner.id * 10 + 3,
                                                        content: `${message.owner.name} is typing`,
                                                        resources: [],
                                                        createdBy: "System",
                                                        modifiedDate: moment(Date.now()).toISOString()
                                                    });
                                                    return data;
                                                }));
                                            break;

                                        case SocketType.STOP_TYPE:
                                            dispatch(messageApi.util?.updateQueryData("getMessageFromChannel",
                                                {locationId: channel.id} as MessageQueryRequest,
                                                data => ({
                                                    ...data, content: data.content.filter(m =>
                                                        m.id != channel.id * 1000 + message.owner.id * 10 + 3)
                                                })));
                                            break;

                                        default:
                                            break;
                                    }
                                }
                            );
                        }));

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
                    channelSet.forEach((channel) => unsubscribeTo(`channel/${channel.id}`));
                }
            }),
            getChannelProfile: builder.query<ChannelResponse, number>({
                query: (id) => ({
                    url: `/channel/${id}`,
                    method: "GET"
                }),
                providesTags: (result) => [{type: "Channel", id: result ? result.id : "LIST"}]
            }),
            createChannel: builder.mutation<void, ChannelCreateRequest>({
                query: ({avatarFile, ...content}) => {
                    const formData = new FormData();
                    if (avatarFile)
                        formData.append("file", avatarFile);
                    formData.append("content", JSON.stringify(content));

                    return ({
                        url: `/channel`,
                        method: "POST",
                        body: formData
                    });
                },
                invalidatesTags: () => [{type: "Channel", id: "LIST"}]
            }),
            updateChannelProfile: builder.mutation<void, ChannelProfileRequest>({
                query: ({channelId, ...content}) => ({
                    url: `/channel/${channelId}/profile`,
                    method: "PUT",
                    body: content
                }),
                invalidatesTags: (_, __, {channelId}) => [{type: "Channel", id: channelId}]
            }),
            updateChannelAvatar: builder.mutation<void, ChannelAvatarRequest>({
                query: ({channelId, avatarFile}) => {
                    const formData = new FormData();
                    formData.append("file", avatarFile);

                    return ({
                        url: `/channel/${channelId}/avatar`,
                        method: "PUT",
                        body: formData
                    });
                },
                invalidatesTags: (_, __, {channelId}) => [{type: "Channel", id: channelId}]
            }),
            disableChannel: builder.mutation<void, number>({
                query: (id) => ({
                    url: `/channel/${id}`,
                    method: "DELETE"
                }),
                invalidatesTags: (_, __, channelId) => [{type: "Channel", id: channelId}]
            }),
            acceptChannelRequest: builder.mutation<void, { channelId: number, memberId: number }>({
                query: ({channelId, memberId}) => ({
                    url: `/channel/${channelId}/member/${memberId}/accept`,
                    method: "PUT"
                }),
                async onQueryStarted(_, {queryFulfilled, dispatch}) {
                    try {
                        await queryFulfilled;

                        dispatch(notificationApi.util?.invalidateTags(["Notification"]));
                    } catch (err) {
                        console.log(err);
                    }
                },
                invalidatesTags: (_, __, {channelId}) => [{type: "Channel", id: channelId}]
            }),
            rejectChannelRequest: builder.mutation<void, { channelId: number, memberId: number }>({
                query: ({channelId, memberId}) => ({
                    url: `/channel/${channelId}/member/${memberId}/reject`,
                    method: "PUT"
                }),
                async onQueryStarted(_, {queryFulfilled, dispatch}) {
                    try {
                        await queryFulfilled;

                        dispatch(notificationApi.util?.invalidateTags(["Notification"]));
                    } catch (err) {
                        console.log(err);
                    }
                }
            }),
            updateMemberPermission: builder.mutation<void, ChannelMemberRequest & { channelId: number }>({
                query: ({channelId, memberId, ...content}) => ({
                    url: `/channel/${channelId}/member/${memberId}`,
                    method: "PUT",
                    body: content
                }),
                invalidatesTags: (_, __, {channelId}) => [{type: "Channel", id: channelId}]
            })
        })
    }
);

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useGetChannelListQuery,
    useGetPersonalChannelListQuery,
    useGetChannelProfileQuery,
    useCreateChannelMutation,
    useUpdateChannelProfileMutation,
    useUpdateChannelAvatarMutation,
    useDisableChannelMutation,
    useAcceptChannelRequestMutation,
    useRejectChannelRequestMutation,
    useUpdateMemberPermissionMutation
} = channelApi;

