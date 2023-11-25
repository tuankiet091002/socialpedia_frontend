import {createApi} from "@reduxjs/toolkit/dist/query/react";
import {baseQueryWithReAuth} from "@utils/reauthQuery.ts";
import {Page} from "../../types.ts";
import {ChannelResponse} from "@features/channels";
import {UserQueryRequest, UserResponse} from "@features/users/types";


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
            getOneUser: builder.query<ChannelResponse, number>({
                query: (id) => ({
                    url: `/user/${id}`,
                    method: "GET",
                }),
                providesTags: (result) => [{type: 'User', id: result ? result.id : "DUMMY"}]
            }),
        }),
    }
)

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useGetUsersQuery,
    useGetOneUserQuery,
} = userApi