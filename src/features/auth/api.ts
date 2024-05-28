import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQueryWithReAuth} from "@utils/reauthQuery.ts";
import storage from "@utils/storage.ts";

import {UserPasswordRequest} from "@features/auth/types/UserPasswordRequest.ts";
import {LoginResponse} from "@features/auth/types/LoginResponse.ts";
import {LoginRequest} from "@features/auth/types/LoginRequest.ts";
import {RegisterRequest} from "@features/auth/types/RegisterRequest.ts";
import {UserProfileRequest} from "@features/auth/types/UserProfileRequest.ts";
import {UserResponse} from "src/features/user/types";
import {UserFriendshipResponse} from "@features/user/types/UserFriendshipResponse.ts";
import {ChannelMemberResponse} from "@features/channel/types/ChannelMemberResponse.ts";
import {notificationApi} from "@features/notification/api.ts";
import {channelApi} from "@features/channel/api.ts";
import {inboxApi} from "@features/inbox/api.ts";

export const authApi = createApi({
        reducerPath: "auth",
        tagTypes: ["Auth", "Friendship", "Member"],
        baseQuery: baseQueryWithReAuth,
        endpoints: (builder) => ({
            login: builder.mutation<LoginResponse, LoginRequest>({
                query: (body) => ({
                    url: "/auth/login",
                    method: "POST",
                    body
                }),
                async onQueryStarted(_, {queryFulfilled, dispatch}) {
                    try {
                        const result = await queryFulfilled;

                        storage.setLoginResponse(result.data);

                        dispatch(notificationApi.util?.invalidateTags(["Notification"]));
                        dispatch(channelApi.util?.invalidateTags(["Channel"]));
                        dispatch(inboxApi.util?.invalidateTags(["Inbox"]));
                    } catch (err) {
                        console.log(err);
                    }
                },
                invalidatesTags: ["Auth", "Friendship", "Member"]
            }),
            register: builder.mutation<void, RegisterRequest & { file?: File }>({
                query: ({file, ...content}) => {

                    const formData = new FormData();
                    formData.append("content", JSON.stringify(content));
                    formData.append("file", file ? file : "");

                    return ({
                        url: "/auth/register",
                        method: "POST",
                        body: formData
                    });
                }
            }),
            refreshToken: builder.mutation<{ accessToken: string }, string>({
                query: (body) => ({
                    url: "/auth/refreshToken",
                    method: "POST",
                    body: {refreshToken: body}
                }),
                async onQueryStarted(_, {queryFulfilled}) {
                    try {
                        const result = await queryFulfilled;

                        storage.setToken(result.data.accessToken);

                    } catch (err) {
                        console.log(err);
                    }
                }
            }),
            updateProfile: builder.mutation<void, UserProfileRequest>({
                query: (body) => ({
                    url: `/auth/profile`,
                    method: "PUT",
                    body
                }),
                invalidatesTags: ["Auth"]
            }),
            updatePassword: builder.mutation<void, UserPasswordRequest>({
                query: (body) => ({
                    url: `/auth/password`,
                    method: "PUT",
                    body
                })
            }),
            updateAvatar: builder.mutation<void, File>({
                query: (file) => {
                    const formData = new FormData();
                    formData.append("file", file);

                    return ({
                        url: `/auth/avatar`,
                        method: "PUT",
                        body: formData
                    });
                },
                invalidatesTags: ["Auth"]
            }),
            getOwner: builder.query<UserResponse, null>({
                query: () => ({
                    url: `/user/${storage.getUser().id}`,
                    method: "GET"
                }),
                async onQueryStarted(_, {queryFulfilled}) {
                    try {
                        await queryFulfilled;
                        // storage.setUser(result.data);
                    } catch (err) {
                        console.log(err);
                    }
                },
                providesTags: ["Auth"]
            }),
            getUserFriendship: builder.query<UserFriendshipResponse | null, number>({
                query: (id) => ({
                    url: `/user/${id}/friendship`,
                    method: "GET"
                }),
                providesTags: (_, __, id) => [{type: "Friendship", id: id}]
            }),
            createFriendRequest: builder.mutation<void, number>({
                query: (id) => ({
                    url: `/user/${id}/friend`,
                    method: "POST"
                }),
                invalidatesTags: (_, __, id) => [{type: "Friendship", id: id}]
            }),
            acceptFriendRequest: builder.mutation<void, number>({
                query: (id) => ({
                    url: `/user/${id}/friend/accept`,
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
                invalidatesTags: (_, __, id) => [{type: "Friendship", id: id}]
            }),
            rejectFriendRequest: builder.mutation<void, number>({
                query: (id) => ({
                    url: `/user/${id}/friend/reject`,
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
                invalidatesTags: (_, __, id) => [{type: "Friendship", id: id}]
            }),
            unFriend: builder.mutation<void, number>({
                query: (id) => ({
                    url: `/user/${id}/friend`,
                    method: "DELETE"
                }),
                invalidatesTags: (_, __, id) => [{type: "Friendship", id: id}]
            }),
            createChannelRequest: builder.mutation<void, number>({
                query: (channelId) => ({
                    url: `/channel/${channelId}/member`,
                    method: "POST"
                }),
                invalidatesTags: (_, __, channelId) => [{type: "Member", id: channelId}]
            }),
            getChannelRelation: builder.query<ChannelMemberResponse, number>({
                query: (channelId) => ({
                    url: `/channel/${channelId}/relation`,
                    method: "GET"
                }),
                providesTags: (_, __, channelId) => [{type: "Member", id: channelId}]
            }),
            leaveChannel: builder.mutation<void, number>({
                query: (channelId) => ({
                    url: `/channel/${channelId}/member/leave`,
                    method: "DELETE"
                }),
                invalidatesTags: (_, __, channelId) => [{type: "Member", id: channelId}]
            })
        })
    }
);

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useLoginMutation,
    useRegisterMutation,
    useUpdateProfileMutation,
    useUpdateAvatarMutation,
    useUpdatePasswordMutation,
    useGetOwnerQuery,
    useGetUserFriendshipQuery,
    useCreateFriendRequestMutation,
    useAcceptFriendRequestMutation,
    useRejectFriendRequestMutation,
    useUnFriendMutation,
    useCreateChannelRequestMutation,
    useGetChannelRelationQuery,
    useLeaveChannelMutation
} = authApi;
