import {createApi} from "@reduxjs/toolkit/dist/query/react";
import {baseQueryWithReAuth} from "@utils/reauthQuery.ts";
import {Page} from "@src/types.ts";
import {UserProfileUpdateRequest, UserQueryRequest, UserResponse} from "@features/users/types";


export const userApi = createApi({
        reducerPath: "user",
        tagTypes: ["User"],
        baseQuery: baseQueryWithReAuth,
        endpoints: (builder) => ({
            getUsers: builder.query<Page<UserResponse>, UserQueryRequest>({
                query: (query) => ({
                    url: "/user",
                    method: "GET",
                    params: query
                }),
                providesTags: (result) => !result ? [{type: 'User', id: "DUMMY"}] :
                    [...result.content.map(({id}) => ({type: 'User' as const, id})), {type: 'User', id: "DUMMY"}],
            }),
            getOneUser: builder.query<UserResponse, string>({
                query: (email) => ({
                    url: `/user/${email}`,
                    method: "GET",
                }),
                providesTags: (result) => [{type: 'User', id: result ? result.id : "DUMMY"}],
            }),
            updateUser: builder.mutation<UserResponse, UserProfileUpdateRequest & { id: number }>({
                query: (body) => ({
                    url: `/user`,
                    method: "PUT",
                    body: body
                }),
                invalidatesTags: (_, __, {id}: { id: number }) => [{type: 'User', id: id}],
            }),
            addFriend: builder.mutation<null, number>({
                query: (id) => ({
                    url: `/user/${id}/friend`,
                    method: "POST",
                }),
                invalidatesTags: (_, __, id) => [{type: 'User', id: id}],
            }),
            deleteFriend: builder.mutation<null, number>({
                query: (id) => ({
                    url: `/user/${id}/friend`,
                    method: "DELETE",
                }),
                invalidatesTags: (_, __, id) => [{type: 'User', id: id}],
            })
        }),
    }
)

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useGetUsersQuery,
    useGetOneUserQuery,
    useUpdateUserMutation,
    useAddFriendMutation,
    useDeleteFriendMutation
} = userApi