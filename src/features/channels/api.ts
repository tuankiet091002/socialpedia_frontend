import {createApi} from '@reduxjs/toolkit/query/react'
import {ChannelQueryRequest, ChannelResponse,} from "@features/channels/types";
import {Page} from "@src/types.ts";
import {difference} from "@utils/arrayUtil.ts";
import {subscribeToChannel} from "@utils/socketMessage.ts";
import {messageApi} from "@features/messages/api.ts";
import {baseQueryWithReAuth} from "@utils/reauthQuery.ts";

const channelSet = new Set<ChannelResponse>();

export const channelApi = createApi({
        reducerPath: "channel",
        tagTypes: ["Channel"],
        baseQuery: baseQueryWithReAuth,
        endpoints: (builder) => ({
            getChannels: builder.query<Page<ChannelResponse>, ChannelQueryRequest>({
                query: (query) => ({
                    url: "/channel",
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
            getOneChannel: builder.query<ChannelResponse, number>({
                query: (id) => ({
                    url: `/channel/${id}`,
                    method: "GET",
                }),
                providesTags: (result) => [{type: 'Channel', id: result ? result.id : "DUMMY"}]
            }),
        }),
    }
)

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useGetChannelsQuery,
    useGetOneChannelQuery,
} = channelApi

