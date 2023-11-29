import {createApi} from '@reduxjs/toolkit/query/react'
import {baseQueryWithReAuth} from "@utils/reauthQuery.ts";
import storage from "@utils/storage.ts";
import {LoginRequest, LoginResponse, RegisterRequest} from "@features/auth/types";
import {UserResponse} from "@features/users/types";

type RefreshTokenResponse = {
    accessToken: string,
    type: string
}


export const authApi = createApi({
        reducerPath: 'auth',
        baseQuery: baseQueryWithReAuth,
        endpoints: (builder) => ({
            login: builder.mutation<LoginResponse, LoginRequest>({
                query: (body) => ({
                    url: '/auth/login',
                    method: "POST",
                    body
                }),
                async onQueryStarted(_, {queryFulfilled}) {
                    try {
                        const result = await queryFulfilled;

                        storage.setLoginResponse(result.data)

                    } catch (err) {
                        console.log(err)
                    }
                },
            }),
            register: builder.mutation<UserResponse, RegisterRequest & { file?: File }>({
                query: ({file, ...content}) => {

                    const formData = new FormData();
                    formData.append("content", JSON.stringify(content))
                    formData.append("file", file ? file : '');

                    return ({
                        url: '/auth/register',
                        method: "POST",
                        body: formData
                    })
                },
            }),
            refreshToken: builder.mutation<RefreshTokenResponse, string>({
                query: (body) => ({
                    url: '/auth/refresh-token',
                    method: "POST",
                    body: {refreshToken: body}
                }),
                async onQueryStarted(_, {queryFulfilled}) {
                    try {
                        const result = await queryFulfilled;

                        storage.setToken(result.data.accessToken)

                    } catch (err) {
                        console.log(err)
                    }
                },
            }),
            getOwner: builder.query<UserResponse, null>({
                query: () => ({
                    url: `/user/${storage.getUser().email}`,
                    method: "GET",
                }),
                async onQueryStarted(_, {queryFulfilled}) {
                    try {
                        const result = await queryFulfilled
                        storage.setUser(result.data)
                    } catch (err) {
                        console.log(err)
                    }
                }
            }),
        }),
    }
)

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {useLoginMutation, useRegisterMutation, useLazyGetOwnerQuery} = authApi
