import {createApi} from "@reduxjs/toolkit/query/react";
import {Page} from "@src/types.ts";
import {baseQueryWithReAuth} from "@utils/reauthQuery.ts";
import {MessageResponse} from "@features/message/types/MessageResponse.ts";
import {MessageQueryRequest} from "@features/message/types/MessageQueryRequest.ts";
import {MessageCreateRequest} from "@features/message/types/MessageCreateRequest.ts";
import {MessageContentRequest} from "@features/message/types/MessageContentRequest.ts";
import {MessageStatusRequest} from "@features/message/types/MessageStatusRequest.ts";

export const messageApi = createApi({
    reducerPath: "message",
    tagTypes: ["Message"],
    baseQuery: baseQueryWithReAuth,
    endpoints: (builder) => ({
        getMessageFromChannel: builder.query<Page<MessageResponse>, MessageQueryRequest>({
            query: ({locationId, ...content}) => ({
                url: `/message/channel/${locationId}`,
                method: "GET",
                params: content
            }),
            providesTags: (result, _, {locationId}) => !result ? [{type: "Message", id: locationId + "_LIST"}] :
                [...result.content.map(({id}) => ({type: "Message" as const, id: locationId + "_" + id})),
                    {type: "Message", id: locationId + "_LIST"}],
            serializeQueryArgs: ({queryArgs, endpointName}) => {
                return endpointName + "_" + queryArgs.locationId;
            },
            forceRefetch({currentArg, previousArg}) {
                return JSON.stringify(currentArg) !== JSON.stringify(previousArg);
            }
        }),
        getMessageFromInbox: builder.query<Page<MessageResponse>, MessageQueryRequest>({
            query: ({locationId, ...content}) => ({
                url: `/message/inbox/${locationId}`,
                method: "GET",
                params: content
            }),
            providesTags: (result, _, {locationId}) => !result ? [{type: "Message", id: locationId + "LIST"}] :
                [...result.content.map(({id}) => ({type: "Message" as const, id: locationId + id})),
                    {type: "Message", id: locationId + "_LIST"}],
            serializeQueryArgs: ({queryArgs, endpointName}) => {
                return endpointName + "_" + queryArgs.locationId;
            },
            forceRefetch({currentArg, previousArg}) {
                return JSON.stringify(currentArg) !== JSON.stringify(previousArg);
            }
        }),
        sendMessageToChannel: builder.mutation<void, MessageCreateRequest>({
            query: ({locationId, files, ...content}) => {

                const formData = new FormData();
                files.forEach(file => formData.append("files", file, file.name));
                formData.append("content", JSON.stringify(content));

                return ({
                    url: `/message/channel/${locationId}`,
                    method: "POST",
                    body: formData
                });
            }
        }),
        sendMessageToInbox: builder.mutation<void, MessageCreateRequest>({
            query: ({locationId, files, ...content}) => {
                const formData = new FormData();
                files.forEach(file => formData.append("files", file));
                formData.append("content", JSON.stringify(content));

                return ({
                    url: `/message/inbox/${locationId}`,
                    method: "POST",
                    body: formData
                });
            }
        }),
        updateMessageContent: builder.mutation<void, MessageContentRequest>({
            query: ({locationId, id, ...status}) => ({
                url: `/message/${locationId}/${id}/content`,
                method: "PUT",
                body: status
            }),
            invalidatesTags: (_, __, {id, locationId}) => [{type: "Message", id: locationId + "_" + id}]
        }),
        updateMessageStatus: builder.mutation<void, MessageStatusRequest>({
            query: ({locationId, id, ...status}) => ({
                url: `/message/${locationId}/${id}/status`,
                method: "PUT",
                body: status
            }),
            invalidatesTags: (_, __, {id, locationId}) => [{type: "Message", id: locationId + "_" + id}]
        }),
        deleteMessage: builder.mutation<void, { locationId: number, id: number }>({
            query: ({locationId, id}) => ({
                url: `/message/${locationId}/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: (_, __, {id, locationId}) => [{type: "Message", id: locationId + "_" + id}]
        })

    })
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useGetMessageFromChannelQuery,
    useGetMessageFromInboxQuery,
    useSendMessageToChannelMutation,
    useSendMessageToInboxMutation,
    useUpdateMessageContentMutation,
    useUpdateMessageStatusMutation,
    useDeleteMessageMutation
} = messageApi;

