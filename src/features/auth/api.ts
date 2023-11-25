import {createApi} from '@reduxjs/toolkit/query/react'
import {LoginRequest, LoginResponse, RegisterRequest, UserResponse} from "@features/auth/types";
import {baseQueryWithReAuth} from "@utils/reauthQuery.ts";
import storage from "@utils/storage.ts";

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
                    url: '/user/login',
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
                        url: '/user/register',
                        method: "POST",
                        body: formData
                    })
                },
            }),
            refreshToken: builder.mutation<RefreshTokenResponse, string>({
                query: (body) => ({
                    url: '/user/refresh-token',
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
        }),
    }
)

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {useLoginMutation, useRegisterMutation} = authApi