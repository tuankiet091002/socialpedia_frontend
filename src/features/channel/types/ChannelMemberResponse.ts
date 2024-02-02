import {UserResponse} from "src/features/user/types";
import {PermissionAccessType, RequestType} from "@src/types.ts";

export type ChannelMemberResponse = {
    member: UserResponse;
    status: RequestType;
    joinedDate: string;
    channelPermission: PermissionAccessType;
    messagePermission: PermissionAccessType;
    memberPermission: PermissionAccessType;
}