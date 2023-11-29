import type {BaseQueryFn, FetchArgs, FetchBaseQueryError,} from '@reduxjs/toolkit/query'
import {fetchBaseQuery} from '@reduxjs/toolkit/query'
import storage from "@utils/storage.ts";

const BASE_URL = 'http://localhost/'


const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: 'include',
    prepareHeaders: async (headers) => {
        const token = storage.getToken();

        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }

        return headers;
    },
})

export const baseQueryWithReAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> =
    async (args, api, extraOptions) => {
        const result = await baseQuery(args, api, extraOptions)
        if (result.error && (result.error.status === 401 || result.error.status === "FETCH_ERROR")) {
            // try to get a new token
            const refreshResult = await baseQuery(
                {
                    url: '/user/refresh-token',
                    method: 'POST',
                    body: {refreshToken: storage.getRefreshToken()},
                    credentials: 'include'
                },
                api, extraOptions)
            if (refreshResult.data) {
                // store the new token
                storage.setToken((refreshResult.data as { accessToken: string }).accessToken as string)
                // retry the initial query
                await baseQuery(args, api, extraOptions)
            } else {
                storage.clearAll();
            }
        }
        return result
    }
