import React from 'react'
import ReactDOM from 'react-dom/client'
import {HelmetProvider} from 'react-helmet-async'

import App from "./App.tsx";

import './index.css'

import {configureStore} from '@reduxjs/toolkit'
import {Provider} from 'react-redux'
import {authApi} from "@features/auth";
import {messageApi} from "@features/messages";
import {channelApi} from "@features/channels";
import {userApi} from "@features/users";
import {setupListeners} from "@reduxjs/toolkit/query";

export * from './routes';

// reducer store config
const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [messageApi.reducerPath]: messageApi.reducer,
        [channelApi.reducerPath]: channelApi.reducer,
        [userApi.reducerPath]: userApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            messageApi.middleware,
            channelApi.middleware,
            userApi.middleware),
    devTools: true
})
setupListeners(store.dispatch)

// apply providers
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <HelmetProvider>
            <Provider store={store}>
                <App/>
            </Provider>
        </HelmetProvider>

    </React.StrictMode>,
)
