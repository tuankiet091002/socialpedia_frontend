import {createApi} from '@reduxjs/toolkit/query/react'
import {Page} from "@src/types.ts";
import {difference} from "@utils/arrayUtil.ts";
import {subscribeToChannel} from "@utils/socketMessage.ts";
import {messageApi} from "@features/message/api.ts";
import {baseQueryWithReAuth} from "@utils/reauthQuery.ts";
import {ChannelResponse} from "@features/channel/types/ChannelResponse.ts";
import {ChannelQueryRequest} from "@features/channel/types/ChannelQueryRequest.ts";
import {ChannelCreateRequest} from "@features/channel/types/ChannelCreateRequest.ts";
import {ChannelProfileRequest} from "@features/channel/types/ChannelProfileRequest.ts";
import {ChannelAvatarRequest} from "@features/channel/types/ChannelAvatarRequest.ts";
import {ChannelMemberRequest} from "@features/channel/types/ChannelMemberRequest.ts";

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
                providesTags: (result) => !result ? [{type: 'Channel', id: "DUMMY"}] :
                    [...result.content.map(({id}) => ({type: 'Channel' as const, id})), {type: 'Channel', id: "DUMMY"}],
            }),
            getPersonalChannelList: builder.query<Page<ChannelResponse>, ChannelQueryRequest>({
                query: (query) => ({
                    url: "/channel/self",
                    method: "GET",
                    params: query
                }),
                providesTags: (result) => !result ? [{type: 'Channel', id: "DUMMY"}] :
                    [...result.content.map(({id}) => ({type: 'Channel' as const, id})), {type: 'Channel', id: "DUMMY"}],
                async onQueryStarted(_, {queryFulfilled, getCacheEntry, dispatch}) {
                    try {
                        await queryFulfilled

                        // compare old and new cache
                        const addedChannel = difference<ChannelResponse>(getCacheEntry().data?.content || [],
                            Array.from(channelSet),
                            (a, b) => a.id === b.id)


                        // add new channel to channelSet and subscribe to new channel
                        addedChannel.forEach(item => {
                            channelSet.add(item)
                            // fetch one when there are new message
                            subscribeToChannel(item.id.toString(), (message) => {
                                    const channelId = +(message.sender);
                                    // fetch the newest message
                                    dispatch(messageApi.endpoints?.getMessages
                                        .initiate({
                                            channel: channelId,
                                            pageNo: 0,
                                            pageSize: 1
                                        }))
                                    // if previous code not work because cache, use this
                                    dispatch(messageApi.util?.invalidateTags([{type: 'Message', id: "DUMMY"}]))

                                    // also re-fetch the channel
                                    dispatch(channelApi.util?.invalidateTags([{type: 'Channel', id: channelId}]))
                                }
                            )
                        })

                    } catch (err) {
                        console.log(err)
                    }
                }
            }),
            getChannelProfile: builder.query<ChannelResponse, number>({
                query: (id) => ({
                    url: `/channel/${id}`,
                    method: "GET",
                }),
                providesTags: (result) => [{type: 'Channel', id: result ? result.id : "DUMMY"}]
            }),
            createChannel: builder.mutation<void, ChannelCreateRequest>({
                query: ({avatarFile, ...content}) => {
                    const formData = new FormData();
                    formData.append("file", avatarFile);
                    formData.append("content", JSON.stringify(content));

                    return ({
                        url: `/channel`,
                        method: "POST",
                        body: formData
                    })
                },
                invalidatesTags: () => [{type: 'Channel', id: "DUMMY"}],
            }),
            updateChannelProfile: builder.mutation<void, ChannelProfileRequest>({
                query: ({channelId, ...content}) => ({
                    url: `/channel/${channelId}/profile`,
                    method: "PUT",
                    body: content
                }),
                invalidatesTags: (_, __, {channelId}) => [{type: 'Channel', id: channelId}],
            }),
            updateChannelAvatar: builder.mutation<void, ChannelAvatarRequest>({
                query: ({channelId, avatarFile}) => {
                    const formData = new FormData();
                    formData.append("file", avatarFile);

                    return ({
                        url: `/channel/${channelId}/avatar`,
                        method: "PUT",
                        body: formData
                    })
                },
                invalidatesTags: (_, __, {channelId}) => [{type: 'Channel', id: channelId}],
            }),
            disableChannel: builder.mutation<void, number>({
                query: (id) => ({
                    url: `/channel/${id}`,
                    method: "DELETE",
                }),
                invalidatesTags: (_, __, channelId) => [{type: 'Channel', id: channelId}],
            }),
            createChannelRequest: builder.mutation<void, number>({
                query: (id) => ({
                    url: `/channel/${id}/member`,
                    method: "GET",
                }),
                invalidatesTags: (_, __, channelId) => [{type: 'Channel', id: channelId}],
            }),
            acceptChannelRequest: builder.mutation<void, { channelId: number, memberId: number }>({
                query: ({channelId, memberId}) => ({
                    url: `/channel/${channelId}/member/${memberId}/accept`,
                    method: "PUT",
                }),
                invalidatesTags: (_, __, {channelId}) => [{type: 'Channel', id: channelId}],
            }),
            rejectChannelRequest: builder.mutation<void, { channelId: number, memberId: number }>({
                query: ({channelId, memberId}) => ({
                    url: `/channel/${channelId}/member/${memberId}/reject`,
                    method: "PUT",
                }),
            }),
            updateMemberPermission: builder.mutation<void, ChannelMemberRequest & { channelId: number }>({
                query: ({channelId, memberId, ...content}) => ({
                    url: `/channel/${channelId}/member/${memberId}`,
                    method: "PUT",
                    body: content
                }),
                invalidatesTags: (_, __, {channelId}) => [{type: 'Channel', id: channelId}],
            }),
            unMember: builder.mutation<void, { channelId: number, memberId: number }>({
                query: ({channelId, memberId}) => ({
                    url: `/channel/${channelId}/member/${memberId}`,
                    method: "DELETE",
                }),
                invalidatesTags: (_, __, {channelId}) => [{type: 'Channel', id: channelId}],
            }),
        }),
    }
)

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
    useCreateChannelRequestMutation,
    useAcceptChannelRequestMutation,
    useRejectChannelRequestMutation,
    useUpdateMemberPermissionMutation,
    useUnMemberMutation
} = channelApi

