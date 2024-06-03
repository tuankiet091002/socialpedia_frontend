import type {PayloadAction} from "@reduxjs/toolkit"
import {createSlice} from "@reduxjs/toolkit"
import {ChannelQueryRequest} from "@features/channel/types/ChannelQueryRequest.ts";
import {InboxQueryRequest} from "@features/inbox/types/InboxQueryRequest.ts";
import {MessageQueryRequest} from "@features/message/types/MessageQueryRequest.ts";


type QueryState = {
    channelQuery: ChannelQueryRequest,
    inboxQuery: InboxQueryRequest,
    messageQuery: MessageQueryRequest[],
}

const initialState: QueryState = {
    channelQuery: {name: "", pageNo: 0, pageSize: 9, orderBy: "modifiedDate" as const, orderDirection: "DESC" as const},
    inboxQuery: {name: "", pageNo: 0, pageSize: 9, orderBy: "modifiedDate" as const, orderDirection: "DESC" as const},
    messageQuery: []
}

export const querySlice = createSlice({
    name: "query",
    initialState,
    reducers: {
        channelQueryChange: (state, action: PayloadAction<ChannelQueryRequest>) => {
            state.channelQuery = action.payload
        },
        inboxQueryChange: (state, action: PayloadAction<InboxQueryRequest>) => {
            state.inboxQuery = action.payload
        },
        messageQueryChange: (state, action: PayloadAction<MessageQueryRequest>) => {
            state.messageQuery = [action.payload, ...state.messageQuery.filter(m => m.locationId != action.payload.locationId)];
        }
    }
})

// Action creators are generated for each case reducer function
export const {channelQueryChange, inboxQueryChange, messageQueryChange} = querySlice.actions