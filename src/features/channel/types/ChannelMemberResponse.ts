import {UserResponse} from "src/features/user/types";
import {PermissionAccessType, RequestType} from "@src/types.ts";

export type ChannelMemberResponse = {
    member: UserResponse;
    status: RequestType;
    messagePermission: PermissionAccessType;
    memberPermission: PermissionAccessType;
}