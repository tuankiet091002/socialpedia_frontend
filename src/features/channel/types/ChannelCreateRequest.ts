import {ChannelMemberRequest} from "@features/channel/types/ChannelMemberRequest.ts";

export type ChannelCreateRequest = {
    name: string;
    description: string;
    avatarFile?: File;
    channelMembersId: ChannelMemberRequest[];
}