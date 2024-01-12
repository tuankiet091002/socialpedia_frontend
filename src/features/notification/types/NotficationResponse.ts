import {NotificationType, ResourceEntity} from "@src/types.ts";

export type NotificationResponse = {
    id: number;
    avatar: ResourceEntity;
    title: string;
    content: string;
    destination: string;
    type: NotificationType;
    createdDate: string;
}
