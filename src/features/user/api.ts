import {createApi} from "@reduxjs/toolkit/dist/query/react";
import {baseQueryWithReAuth} from "@utils/reauthQuery.ts";
import {Page} from "@src/types.ts";
import {UserQueryRequest, UserResponse} from "@features/user/types";
import {UserRoleRequest} from "@features/user/types/UserRoleRequest.ts";
import {UserFriendshipResponse} from "@features/user/types/UserFriendshipResponse.ts";


export const userApi = createApi({
        reducerPath: "user",
        tagTypes: ["User"],
        baseQuery: baseQueryWithReAuth,
        endpoints: (builder) => ({
            getUserList: builder.query<Page<UserResponse>, UserQueryRequest>({
                query: (query) => ({
                    url: "/user",
                    method: "GET",
                    params: query
                }),
                providesTags: (result) => !result ? [{type: "User", id: "LIST"}] :
                    [...result.content.map(({id}) => ({type: "User" as const, id})), {type: "User", id: "LIST"}]
            }),
            getOtherUserList: builder.query<Page<UserResponse>, UserQueryRequest>({
                query: (query) => ({
                    url: "/user/other",
                    method: "GET",
                    params: query
                }),
                providesTags: (result) => !result ? [{type: "User", id: "LIST"}] :
                    [...result.content.map(({id}) => ({type: "User" as const, id})), {type: "User", id: "LIST"}]
            }),
            getFriendList: builder.query<Page<UserFriendshipResponse>, UserQueryRequest>({
                query: (query) => ({
                    url: "/user/friend",
                    method: "GET",
                    params: query
                }),
                providesTags: (result) => !result ? [{type: "User", id: "LIST"}] :
                    [...result.content.map(({other}) => ({type: "User" as const, other: other.id})),
                        {type: "User", id: "LIST"}, {type: "User", id: "FRIEND_LIST"}]
            }),
            getUserProfile: builder.query<UserResponse, number>({
                query: (id) => ({
                    url: `/user/${id}`,
                    method: "GET"
                }),
                providesTags: (result) => [{type: "User", id: result ? result.id : "LIST"}]
            }),
            updateUserRole: builder.mutation<void, UserRoleRequest>({
                query: ({id, ...role}) => ({
                    url: `/user/${id}/role`,
                    method: "PUT",
                    params: role
                }),
                invalidatesTags: (_, __, {id}: { id: number }) => [{type: "User", id: id}]
            }),
            disableUser: builder.mutation<void, number>({
                query: (id) => ({
                    url: `/user/${id}`,
                    method: "DELETE"
                }),
                invalidatesTags: (_, __, id) => [{type: "User", id: id}]
            })
        })
    }
);

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useGetUserListQuery,
    useGetOtherUserListQuery,
    useGetFriendListQuery,
    useGetUserProfileQuery,
    useUpdateUserRoleMutation,
    useDisableUserMutation
} = userApi;