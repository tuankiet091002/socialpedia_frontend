import {ResourceEntity} from "../../../types.ts";
import {MessageResponse} from "@features/messages";

export type ChannelResponse = {
    id: number;
    name: string;
    avatar: ResourceEntity
    latestMessage?: MessageResponse
}