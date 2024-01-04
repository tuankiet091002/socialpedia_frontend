import {PermissionAccessType} from "@src/types.ts";

export type ChannelMemberRequest = {
    memberId: number;
    chatPermission: PermissionAccessType;
    messagePermission: PermissionAccessType;
}