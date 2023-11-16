import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {LoginRequest, LoginResponse, RegisterRequest, UserResponse} from "@features/auth/types";
import storage from "@utils/storage.ts";

export const authApi = createApi({
        reducerPath: "auth",
        baseQuery: fetchBaseQuery({baseUrl: 'http://localhost/user'}),
        endpoints: (builder) => ({
            login: builder.mutation<LoginResponse, LoginRequest>({
                query: (body) => ({
                    url: '/login',
                    method: "POST",
                    body
                }),
                async onQueryStarted(_, {queryFulfilled}) {
                    try {
                        const result = await queryFulfilled;
                        storage.setLoginResponse(result.data)

                        console.log(result.data)

                    } catch (err) {
                        console.log(err)
                    }
                },
            }),
            register: builder.mutation<UserResponse, RegisterRequest & {file?: File}>({
                query: ({file, ...content}) => {

                    const formData = new FormData();
                    formData.append("content", JSON.stringify(content))
                    formData.append("file", file ? file : '');

                    return ({
                        url: '/register',
                        method: "POST",
                        body: formData
                    })
                },
                async onQueryStarted(_, {queryFulfilled}) {
                    try {
                        const result = await queryFulfilled;

                        console.log(result)
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
