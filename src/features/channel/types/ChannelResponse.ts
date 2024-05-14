import {ResourceEntity} from "@src/types.ts";
import {UserResponse} from "src/features/user/types";
import {MessageResponse} from "@features/message/types/MessageResponse.ts";
import {ChannelMemberResponse} from "@features/channel/types/ChannelMemberResponse.ts";


export type ChannelResponse = {
    id: number;
    name: string;
    description: string;
    memberNum: number;
    avatar: ResourceEntity;
    latestMessage?: MessageResponse;
    createdBy: UserResponse;
    createdDate: string;
    modifiedBy?: UserResponse;
    modifiedDate: string;
    channelMembers: ChannelMemberResponse[];
}