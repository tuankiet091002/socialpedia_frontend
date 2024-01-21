import React from "react";
import ReactDOM from "react-dom/client";
import {HelmetProvider} from "react-helmet-async";

import App from "./App.tsx";

import "./index.css";

import {configureStore} from "@reduxjs/toolkit";
import {Provider} from "react-redux";
import {authApi} from "@features/auth/api.ts";
import {channelApi} from "@features/channel/api.ts";
import {inboxApi} from "@features/inbox/api.ts";
import {userApi} from "@features/user/api.ts";
import {querySlice} from "@src/querySlice.ts";
import {notificationApi} from "@features/notification/api.ts";
import {setupListeners} from "@reduxjs/toolkit/query";
import {messageApi} from "@features/message/api.ts";

// reducer store config
const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [messageApi.reducerPath]: messageApi.reducer,
        [channelApi.reducerPath]: channelApi.reducer,
        [inboxApi.reducerPath]: inboxApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [notificationApi.reducerPath]: notificationApi.reducer,
        [querySlice.name]: querySlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            messageApi.middleware,
            channelApi.middleware,
            inboxApi.middleware,
            userApi.middleware,
            notificationApi.middleware),
    devTools: true
});
setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

// apply providers
ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <HelmetProvider>
            <Provider store={store}>
                <App/>
            </Provider>
        </HelmetProvider>
    </React.StrictMode>
);
