import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {AuthResponse, LoginUserRequest, RegisterUserRequest} from "@features/auth/types.ts";

export const authApi = createApi({
        reducerPath: "auth",
        baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:3000/auth'}),
        endpoints: (builder) => ({
            login: builder.mutation<AuthResponse, LoginUserRequest>({
                query: (body) => ({
                    url: '/login',
                    method: "POST",
                    body
                }),
                async onQueryStarted(_, {queryFulfilled}) {
                    try {
                        const result = await queryFulfilled;

                        localStorage.setItem(
                            "auth",
                            JSON.stringify({
                                token: result.data.jwt,
                                user: result.data.user
                            })
                        );

                    } catch (err) {
                        console.log(err)
                    }
                },
            }),
            register: builder.mutation<AuthResponse, RegisterUserRequest>({
                query: (body) => ({
                    url: '/register',
                    method: "POST",
                    body: body
                }),
                async onQueryStarted(_, {queryFulfilled}) {
                    try {
                        const result = await queryFulfilled;

                        localStorage.setItem(
                            "auth",
                            JSON.stringify({
                                token: result.data.jwt,
                                user: result.data.user
                            })
                        );

                    } catch (err) {
                        console.log(err)
                    }
                },
            })
        }),
    }
)

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {useLoginMutation, useRegisterMutation} = authApi
