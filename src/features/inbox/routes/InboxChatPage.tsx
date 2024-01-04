import {ChatTitle} from "@features/message/components/ChatTitle.tsx";
import {MessageList} from "@features/message/components/MessageList.tsx";
import {MessageInput} from "@features/message/components/MessageInput.tsx";
import {useGetMessageFromInboxQuery, useSendMessageToInboxMutation} from "@features/message/api.ts";

export const InboxChatPage = () => {

    return (
        <div className="card p-0 h-100">
            <div className="card-header d-flex justify-content-between align-items-center p-3" style={{height: '80px'}}>
                <ChatTitle/>
            </div>
            <div className="card-body p-2" style={{height: "calc(100vh - 217px)"}}>
                <MessageList queryFunc={useGetMessageFromInboxQuery}/>
            </div>
            <div className="card-footer d-flex justify-content-start align-items-center p-3"
                 style={{height: '80px'}}>
                <MessageInput queryFunc={useSendMessageToInboxMutation}/>
            </div>
        </div>
    );
}