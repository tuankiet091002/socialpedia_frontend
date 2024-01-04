import {UserResponse} from "src/features/user/types";
import {PermissionAccessType} from "@src/types.ts";

export type ChannelMemberResponse = {
    member: UserResponse;
    messagePermission: PermissionAccessType;
    memberPermission: PermissionAccessType;
}