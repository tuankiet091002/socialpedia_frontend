import {ChatTitle, MessageInput, MessageList} from "@features/messages/components";

export const Messages = () => {
    return (
        <div className="card p-0 h-100">
            <div className="card-header d-flex justify-content-between align-items-center p-3" style={{height: '80px'}}>
                <ChatTitle/>
            </div>
            <div className="card-body p-2" style={{height: "calc(100vh - 217px)"}}>
                <MessageList/>
            </div>
            <div
                className="card-footer d-flex justify-content-start align-items-center p-3" style={{height: '80px'}}>
                <MessageInput/>
            </div>
        </div>
    )
}