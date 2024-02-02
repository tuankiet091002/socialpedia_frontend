export type ChannelMemberRequest = {
    memberId: number;
    channelPermission: string;
    messagePermission: string;
    memberPermission: string;
}