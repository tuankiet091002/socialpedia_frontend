import {FormEvent} from "react";
import {useParams} from "react-router-dom";
import {useCreateMessageMutation} from "@features/messages/api.ts";

export const MessageInput = () => {
    const {channelId} = useParams();
    const [createMessage] = useCreateMessageMutation();

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const target = e.target as typeof e.target & {
            content: { value: string };
        };
        const content = target.content.value;

        createMessage({channelId: +(channelId as string), content: content})
    }

    return (<div className="container-fluid">
        <form className="d-flex justify-content-between" onSubmit={handleSubmit}>
            <input type="text" name="content" className="form-control w-75 me-2" placeholder="Enter text here"/>
            <button type="submit" className="btn btn-primary w-25">Send</button>
        </form>
    </div>)
}