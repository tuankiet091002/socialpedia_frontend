import {ChatTitle} from "@features/messages/components/ChatTitle.tsx";
import {ChatContent} from "@features/messages/components/ChatContent.tsx";
import {ChatInput} from "@features/messages/components/ChatInput.tsx";

export const Messages = () => {
    return (
        <div className="card p-0 h-100">
            <div className="card-header d-flex justify-content-between align-items-center p-3">
                <ChatTitle/>
            </div>
            <div className="card-body p-2 overflow-auto"
                 style={{position: 'relative', height: '200px'}}>
                <ChatContent/>
            </div>
            <div
                className="card-footer text-muted d-flex justify-content-start align-items-center p-3">
                <ChatInput/>
            </div>
        </div>
    )
}