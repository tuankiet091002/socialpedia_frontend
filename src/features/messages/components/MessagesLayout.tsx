import {ContentLayout} from "@components/Layout";
import {Outlet} from "react-router-dom";
import {ChannelColumn} from "@features/channels/components/ChannelColumn.tsx";

type MessagesLayoutProps = {
    title: string;
};

export const MessagesLayout = ({title}: MessagesLayoutProps) => {
    return (
        <ContentLayout title={title} navbar={<ChannelColumn/>}>
            <Outlet/>
        </ContentLayout>
    )
}