import {FormEvent} from "react";
import {useParams} from "react-router-dom";
import {BaseQueryFn, FetchArgs, FetchBaseQueryError, MutationDefinition} from "@reduxjs/toolkit/query";
import {UseMutation} from "@reduxjs/toolkit/dist/query/react/buildHooks";
import {MessageCreateRequest} from "@features/message/types/MessageCreateRequest.ts";

type MessageInputProps = {
    queryFunc: UseMutation<MutationDefinition<
        MessageCreateRequest,
        BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
        "Message",
        void,
        "message">>;
}

export const MessageInput = ({queryFunc}: MessageInputProps) => {
    const {locationId} = useParams();
    const [createMessage] = queryFunc();

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const target = e.target as typeof e.target & {
            content: { value: string };
        };
        const content = target.content.value;

        createMessage({locationId: +(locationId as string), content: content, files: null})
    }

    return (<div className="container-fluid">
        <form className="d-flex justify-content-between" onSubmit={handleSubmit}>
            <input type="text" name="content" className="form-control w-75 me-2" placeholder="Enter text here"/>
            <button type="submit" className="btn btn-primary w-25">Send</button>
        </form>
    </div>)
}