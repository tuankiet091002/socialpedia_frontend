import {MessageResponse} from "@features/messages";
import moment from "moment";

type MessageProps = {
    content: MessageResponse
};

export const Message = ({content}: MessageProps) => {

    return (<li className="p-2 border-bottom" style={{height: '200px'}}>
        <div className="d-flex justify-content-between">
            <div className="pt-1 text-start">
                <p className="fw-bold mb-0">{content.content}</p>
            </div>
            <div className="pt-1">
                <p className="small text-muted mb-1">{moment(content.createdDate).fromNow()}</p>
            </div>
        </div>
    </li>)
}